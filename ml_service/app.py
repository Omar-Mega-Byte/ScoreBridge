"""
ScoreBridge ML Model API Service
Flask API for credit score prediction using trained Random Forest model.

Author: ScoreBridge Team
Version: 1.0
Date: 2025-10-12
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Get directory of this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to model files (relative to this script)
MODEL_PATH = os.path.join(SCRIPT_DIR, 'model', 'credit_score_model.pkl')
SCALER_PATH = os.path.join(SCRIPT_DIR, 'model', 'scaler.pkl')
METADATA_PATH = os.path.join(SCRIPT_DIR, 'model', 'encoders.pkl')

# Global variables for model
model = None
scaler = None
metadata = None

def load_model_files():
    """Load trained model, scaler, and metadata."""
    global model, scaler, metadata
    
    try:
        logger.info("Loading model files...")
        
        # Load model
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        logger.info("Model loaded successfully")
        
        # Load scaler
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)
        logger.info("Scaler loaded successfully")
        
        # Load metadata
        with open(METADATA_PATH, 'rb') as f:
            metadata = pickle.load(f)
        logger.info(f"Metadata loaded. Model version: {metadata['model_version']}")
        
        return True
    except Exception as e:
        logger.error(f"Error loading model files: {str(e)}")
        return False

def engineer_features(data):
    """Engineer features from input data."""
    
    # Component P: Payment Consistency (0-100)
    payment_consistency = 100 - np.clip(
        (data['delayFromDueDate'] * 2) + (data['numOfDelayedPayment'] * 3), 0, 100
    )
    
    # Component I: Income Reliability (0-100)
    monthly_expected = data['annualIncome'] / 12
    income_ratio = data['monthlyInhandSalary'] / monthly_expected if monthly_expected > 0 else 0
    income_reliability = np.clip(
        (data['annualIncome'] / 100000 * 50) + (income_ratio * 50),
        0, 100
    )
    
    # Component T: Transaction Patterns (0-100)
    emi_ratio = data['totalEmiPerMonth'] / data['monthlyInhandSalary'] if data['monthlyInhandSalary'] > 0 else 0
    investment_ratio = data['amountInvestedMonthly'] / data['monthlyInhandSalary'] if data['monthlyInhandSalary'] > 0 else 0
    transaction_patterns = np.clip(
        (1 - emi_ratio) * 40 + (investment_ratio * 100) * 0.3 + (50 - data['numCreditInquiries'] * 5),
        0, 100
    )
    
    # Component S: Savings Stability (0-100)
    balance_ratio = data['monthlyBalance'] / data['monthlyInhandSalary'] if data['monthlyInhandSalary'] > 0 else 0
    savings_stability = np.clip(
        (balance_ratio * 50) + (50 - data['creditUtilizationRatio']),
        0, 100
    )
    
    # Additional features
    debt_to_income = data['outstandingDebt'] / data['annualIncome'] if data['annualIncome'] > 0 else 0
    total_accounts = data['numBankAccounts'] + data['numCreditCard']
    
    return {
        'payment_consistency': payment_consistency,
        'income_reliability': income_reliability,
        'transaction_patterns': transaction_patterns,
        'savings_stability': savings_stability,
        'debt_to_income': debt_to_income,
        'total_accounts': total_accounts
    }

def create_feature_vector(data):
    """Create feature vector from input data matching training features."""
    
    engineered = engineer_features(data)
    
    # Create feature vector matching training order
    features = [
        data['age'],
        data['annualIncome'],
        data['monthlyInhandSalary'],
        data['monthlyBalance'],
        data['numBankAccounts'],
        data['numCreditCard'],
        data['interestRate'],
        data['numOfLoan'],
        data['delayFromDueDate'],
        data['numOfDelayedPayment'],
        data['numCreditInquiries'],
        data['creditUtilizationRatio'],
        data['creditHistoryAgeMonths'],
        data['totalEmiPerMonth'],
        data['amountInvestedMonthly'],
        data['outstandingDebt'],
        engineered['payment_consistency'],
        engineered['income_reliability'],
        engineered['transaction_patterns'],
        engineered['savings_stability'],
        engineered['debt_to_income'],
        engineered['total_accounts']
    ]
    
    return np.array(features).reshape(1, -1), engineered

def map_score_to_range(category):
    """Map credit score category to numerical score (300-850)."""
    score_mapping = {
        'Poor': 450,
        'Standard': 550,
        'Fair': 600,
        'Good': 700,
        'Very Good': 750,
        'Excellent': 800
    }
    return score_mapping.get(category, 600)

def determine_weights():
    """Return optimal weights learned from data."""
    # These weights can be adjusted based on your specific requirements
    return {
        'alpha': 0.35,  # Payment consistency
        'beta': 0.25,   # Income reliability
        'gamma': 0.20,  # Transaction patterns
        'delta': 0.20   # Savings stability
    }

@app.route('/', methods=['GET'])
def root():
    """Root endpoint - API information."""
    return jsonify({
        'name': 'ScoreBridge ML API',
        'version': '1.0',
        'status': 'online',
        'endpoints': {
            '/health': 'GET - Health check',
            '/predict': 'POST - Predict credit score'
        }
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'version': metadata['model_version'] if metadata else 'unknown'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Predict credit score from financial data."""
    
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info("Received prediction request")
        
        # Create feature vector
        features, engineered = create_feature_vector(data)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        prediction_proba = model.predict_proba(features_scaled)[0]
        
        # Map category to score
        predicted_score = map_score_to_range(prediction)
        
        # Calculate confidence
        confidence = float(np.max(prediction_proba) * 100)
        
        # Get weights
        weights = determine_weights()
        
        # Calculate ScoreBridge Index (SBI) using weighted formula
        # SBI = αP + βI + γT + δS
        weighted_score = (
            weights['alpha'] * engineered['payment_consistency'] +
            weights['beta'] * engineered['income_reliability'] +
            weights['gamma'] * engineered['transaction_patterns'] +
            weights['delta'] * engineered['savings_stability']
        )
        
        # Normalize to 300-850 range
        final_score = int(300 + (weighted_score / 100) * 550)
        
        # Use model prediction to adjust if significantly different
        if abs(final_score - predicted_score) > 100:
            final_score = int((final_score + predicted_score) / 2)
        
        # Determine final category
        if final_score >= 750:
            category = "Excellent"
        elif final_score >= 700:
            category = "Very Good"
        elif final_score >= 650:
            category = "Good"
        elif final_score >= 600:
            category = "Fair"
        else:
            category = "Poor"
        
        # Build response
        response = {
            'predictedScore': final_score,
            'scoreCategory': category,
            'paymentConsistency': float(engineered['payment_consistency']),
            'incomeReliability': float(engineered['income_reliability']),
            'transactionPatterns': float(engineered['transaction_patterns']),
            'savingsStability': float(engineered['savings_stability']),
            'alphaWeight': weights['alpha'],
            'betaWeight': weights['beta'],
            'gammaWeight': weights['gamma'],
            'deltaWeight': weights['delta'],
            'modelVersion': metadata['model_version'],
            'confidenceLevel': confidence
        }
        
        logger.info(f"Prediction successful. Score: {final_score}, Category: {category}")
        
        return jsonify(response), 200
        
    except KeyError as e:
        logger.error(f"Missing required field: {str(e)}")
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Generate personalized recommendations based on financial data and score."""
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info("Received recommendations request")
        
        # Extract key financial metrics
        payment_consistency = data.get('paymentConsistency', 0)
        income_reliability = data.get('incomeReliability', 0)
        transaction_patterns = data.get('transactionPatterns', 0)
        savings_stability = data.get('savingsStability', 0)
        current_score = data.get('currentScore', 600)
        
        recommendations = []
        
        # Payment consistency recommendations
        if payment_consistency < 70:
            recommendations.append({
                'category': 'Payment Consistency',
                'priority': 'high',
                'title': 'Improve Payment Timeliness',
                'description': 'Your payment history needs attention. Set up automatic payments to avoid missed deadlines.',
                'impact': 'Could improve score by 30-50 points',
                'actions': [
                    'Enable auto-pay for all credit cards and loans',
                    'Set up payment reminders 3 days before due dates',
                    'Create a payment calendar for all obligations'
                ]
            })
        elif payment_consistency < 85:
            recommendations.append({
                'category': 'Payment Consistency',
                'priority': 'medium',
                'title': 'Maintain Payment Discipline',
                'description': 'Good payment history! Keep it up to reach excellent status.',
                'impact': 'Could improve score by 10-20 points',
                'actions': [
                    'Continue making on-time payments',
                    'Review payment schedule monthly',
                    'Build a 2-month payment buffer'
                ]
            })
        
        # Income reliability recommendations
        if income_reliability < 70:
            recommendations.append({
                'category': 'Income Reliability',
                'priority': 'high',
                'title': 'Stabilize Income Sources',
                'description': 'Lenders prefer consistent income. Work on building stable income streams.',
                'impact': 'Could improve score by 25-40 points',
                'actions': [
                    'Maintain regular salary deposits in the same account',
                    'Consider side income from stable sources',
                    'Document all income sources properly'
                ]
            })
        
        # Credit utilization recommendations
        credit_util = data.get('creditUtilizationRatio', 0)
        if credit_util > 30:
            recommendations.append({
                'category': 'Credit Utilization',
                'priority': 'high',
                'title': 'Reduce Credit Card Usage',
                'description': f'Your credit utilization is {credit_util}%. Keep it below 30% for optimal scores.',
                'impact': 'Could improve score by 40-60 points',
                'actions': [
                    'Pay down credit card balances aggressively',
                    'Request credit limit increases',
                    'Use debit cards for daily purchases',
                    f'Target: Reduce utilization to below 30% (currently {credit_util}%)'
                ]
            })
        
        # Savings and investment recommendations
        monthly_salary = data.get('monthlyInhandSalary', 1)
        monthly_balance = data.get('monthlyBalance', 0)
        investment = data.get('amountInvestedMonthly', 0)
        
        if monthly_balance / monthly_salary < 0.3:
            recommendations.append({
                'category': 'Savings Stability',
                'priority': 'high',
                'title': 'Build Emergency Fund',
                'description': 'Your savings buffer is low. Build an emergency fund for financial security.',
                'impact': 'Could improve score by 20-35 points',
                'actions': [
                    'Save at least 20% of monthly income',
                    'Build 3-6 months emergency fund',
                    'Open a high-yield savings account',
                    'Automate monthly transfers to savings'
                ]
            })
        
        if investment / monthly_salary < 0.1:
            recommendations.append({
                'category': 'Investment & Planning',
                'priority': 'medium',
                'title': 'Start Systematic Investments',
                'description': 'Regular investments show financial planning and discipline.',
                'impact': 'Could improve score by 15-25 points',
                'actions': [
                    'Start SIP/mutual fund investments (10% of income)',
                    'Consider retirement planning accounts',
                    'Diversify investment portfolio',
                    'Review and increase investments annually'
                ]
            })
        
        # Debt management
        emi_ratio = data.get('totalEmiPerMonth', 0) / monthly_salary if monthly_salary > 0 else 0
        if emi_ratio > 0.4:
            recommendations.append({
                'category': 'Debt Management',
                'priority': 'high',
                'title': 'Reduce EMI Burden',
                'description': f'Your EMI to income ratio is {emi_ratio*100:.1f}%. This is high and affects your borrowing capacity.',
                'impact': 'Could improve score by 30-45 points',
                'actions': [
                    'Consider debt consolidation at lower interest',
                    'Avoid taking new loans until ratio improves',
                    'Make extra payments towards high-interest debt',
                    f'Target: Reduce EMI ratio below 40% (currently {emi_ratio*100:.1f}%)'
                ]
            })
        
        # Credit inquiry recommendations
        num_inquiries = data.get('numCreditInquiries', 0)
        if num_inquiries > 3:
            recommendations.append({
                'category': 'Credit Inquiries',
                'priority': 'medium',
                'title': 'Limit Credit Applications',
                'description': f'You have {num_inquiries} recent credit inquiries. Too many can hurt your score.',
                'impact': 'Could improve score by 10-20 points',
                'actions': [
                    'Avoid applying for new credit for 6 months',
                    'Pre-qualify for credit before formal applications',
                    'Space out credit applications by 3-6 months',
                    'Only apply for credit you truly need'
                ]
            })
        
        # Overall improvement plan
        if current_score < 700:
            recommendations.append({
                'category': 'Overall Strategy',
                'priority': 'high',
                'title': '90-Day Score Boost Plan',
                'description': 'Follow this strategic plan to improve your score significantly.',
                'impact': 'Could improve score by 50-80 points in 3 months',
                'actions': [
                    'Week 1-2: Set up all automatic payments',
                    'Week 3-4: Pay down highest interest debt',
                    'Month 2: Build emergency savings to 50% of salary',
                    'Month 3: Start small monthly investments',
                    'Monitor score monthly and adjust strategy'
                ]
            })
        
        # Sort by priority
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 2))
        
        response = {
            'currentScore': current_score,
            'recommendations': recommendations,
            'potentialScore': min(850, current_score + len([r for r in recommendations if r['priority'] == 'high']) * 25),
            'timeframe': '3-6 months with consistent improvements',
            'nextReview': 'Review progress in 30 days'
        }
        
        logger.info(f"Generated {len(recommendations)} recommendations")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Recommendations error: {str(e)}")
        return jsonify({'error': f'Recommendations generation failed: {str(e)}'}), 500

@app.route('/simulate', methods=['POST'])
def simulate_score():
    """Simulate what-if scenarios for score changes."""
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info("Received simulation request")
        
        # Get current data
        current_data = data.get('currentData', {})
        changes = data.get('changes', {})
        
        # Apply changes to create new scenario
        simulated_data = current_data.copy()
        simulated_data.update(changes)
        
        # Calculate both current and simulated scores
        current_features, current_engineered = create_feature_vector(current_data)
        simulated_features, simulated_engineered = create_feature_vector(simulated_data)
        
        # Get predictions
        current_scaled = scaler.transform(current_features)
        simulated_scaled = scaler.transform(simulated_features)
        
        current_prediction = model.predict(current_scaled)[0]
        simulated_prediction = model.predict(simulated_scaled)[0]
        
        current_score = map_score_to_range(current_prediction)
        simulated_score = map_score_to_range(simulated_prediction)
        
        # Calculate weighted scores
        weights = determine_weights()
        
        current_weighted = int(300 + (
            weights['alpha'] * current_engineered['payment_consistency'] +
            weights['beta'] * current_engineered['income_reliability'] +
            weights['gamma'] * current_engineered['transaction_patterns'] +
            weights['delta'] * current_engineered['savings_stability']
        ) / 100 * 550)
        
        simulated_weighted = int(300 + (
            weights['alpha'] * simulated_engineered['payment_consistency'] +
            weights['beta'] * simulated_engineered['income_reliability'] +
            weights['gamma'] * simulated_engineered['transaction_patterns'] +
            weights['delta'] * simulated_engineered['savings_stability']
        ) / 100 * 550)
        
        # Convert all numpy types to native Python types for JSON serialization
        response = {
            'currentScore': int(current_weighted),
            'simulatedScore': int(simulated_weighted),
            'scoreDifference': int(simulated_weighted - current_weighted),
            'percentageChange': float(((simulated_weighted - current_weighted) / current_weighted * 100) if current_weighted > 0 else 0),
            'changesApplied': changes,
            'componentChanges': {
                'payment': float(float(simulated_engineered['payment_consistency']) - float(current_engineered['payment_consistency'])),
                'income': float(float(simulated_engineered['income_reliability']) - float(current_engineered['income_reliability'])),
                'transaction': float(float(simulated_engineered['transaction_patterns']) - float(current_engineered['transaction_patterns'])),
                'savings': float(float(simulated_engineered['savings_stability']) - float(current_engineered['savings_stability']))
            },
            'recommendation': 'positive' if simulated_weighted > current_weighted else 'negative' if simulated_weighted < current_weighted else 'neutral'
        }
        
        score_diff = int(simulated_weighted - current_weighted)
        logger.info(f"Simulation: {int(current_weighted)} -> {int(simulated_weighted)} ({score_diff:+d} points)")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Simulation error: {str(e)}")
        return jsonify({'error': f'Simulation failed: {str(e)}'}), 500

@app.route('/analyze-spending', methods=['POST'])
def analyze_spending():
    """Analyze spending patterns and provide insights."""
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info("Received spending analysis request")
        
        monthly_salary = data.get('monthlyInhandSalary', 1)
        monthly_balance = data.get('monthlyBalance', 0)
        total_emi = data.get('totalEmiPerMonth', 0)
        investments = data.get('amountInvestedMonthly', 0)
        
        # Calculate spending metrics
        estimated_spending = monthly_salary - monthly_balance - investments
        emi_ratio = (total_emi / monthly_salary * 100) if monthly_salary > 0 else 0
        savings_rate = (monthly_balance / monthly_salary * 100) if monthly_salary > 0 else 0
        investment_rate = (investments / monthly_salary * 100) if monthly_salary > 0 else 0
        spending_rate = (estimated_spending / monthly_salary * 100) if monthly_salary > 0 else 0
        
        # Determine spending health
        if spending_rate < 50:
            spending_health = 'Excellent'
            health_color = 'success'
        elif spending_rate < 70:
            spending_health = 'Good'
            health_color = 'info'
        elif spending_rate < 85:
            spending_health = 'Fair'
            health_color = 'warning'
        else:
            spending_health = 'Needs Attention'
            health_color = 'danger'
        
        insights = []
        
        # Generate insights
        if emi_ratio > 40:
            insights.append({
                'type': 'warning',
                'title': 'High Debt Burden',
                'message': f'EMI consumes {emi_ratio:.1f}% of income. Recommended: below 40%'
            })
        
        if savings_rate < 20:
            insights.append({
                'type': 'warning',
                'title': 'Low Savings Rate',
                'message': f'Saving only {savings_rate:.1f}% of income. Target: 20-30%'
            })
        else:
            insights.append({
                'type': 'success',
                'title': 'Good Savings Habit',
                'message': f'Great! You\'re saving {savings_rate:.1f}% of income'
            })
        
        if investment_rate < 10:
            insights.append({
                'type': 'info',
                'title': 'Investment Opportunity',
                'message': 'Consider investing 10-15% of income for long-term wealth'
            })
        
        response = {
            'spendingHealth': spending_health,
            'healthColor': health_color,
            'metrics': {
                'emiRatio': round(emi_ratio, 1),
                'savingsRate': round(savings_rate, 1),
                'investmentRate': round(investment_rate, 1),
                'spendingRate': round(spending_rate, 1)
            },
            'breakdown': {
                'income': monthly_salary,
                'emi': total_emi,
                'investments': investments,
                'savings': monthly_balance,
                'estimatedSpending': estimated_spending
            },
            'insights': insights,
            'recommendations': [
                'Track expenses using a budgeting app',
                'Follow 50/30/20 rule: 50% needs, 30% wants, 20% savings',
                'Review subscriptions and cut unused services',
                'Set spending alerts on credit cards'
            ]
        }
        
        logger.info(f"Spending analysis: {spending_health} health")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Spending analysis error: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Load model files
    if not load_model_files():
        logger.error("Failed to load model files. Please train the model first.")
        logger.info("Run: python train_model.py")
        exit(1)
    
    # Get port from environment variable (for deployment)
    port = int(os.environ.get('PORT', 5000))
    
    # Start Flask app
    logger.info(f"Starting Flask API server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
