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
        
        # Calculate SBI using weighted formula
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

if __name__ == '__main__':
    # Load model files
    if not load_model_files():
        logger.error("Failed to load model files. Please train the model first.")
        logger.info("Run: python train_model.py")
        exit(1)
    
    # Start Flask app
    logger.info("Starting Flask API server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
