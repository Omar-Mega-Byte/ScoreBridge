"""
ScoreBridge ML Model Training Script
Trains a Random Forest model on credit score data to predict credit scores.

Author: ScoreBridge Team
Version: 1.0
Date: 2025-10-12
"""

import pandas as pd
import numpy as np
import pickle
import warnings
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

warnings.filterwarnings('ignore')

# Get the project root directory (parent of ml_service)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# File paths
TRAIN_DATA_PATH = os.path.join(PROJECT_ROOT, 'src', 'main', 'java', 'com', 'scorebridge', 
                                'credit_score_sys', 'modules', 'scoring', 'ml', 'train.csv')
MODEL_OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'model', 'credit_score_model.pkl')
SCALER_OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'model', 'scaler.pkl')
ENCODERS_OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'model', 'encoders.pkl')

def clean_data(df):
    """Clean and preprocess the dataset."""
    print("Cleaning data...")
    
    # Handle missing values denoted as '_', 'NA', '#F%$D@*&8', '!@9#%8', etc.
    df = df.replace(['_', 'NA', '#F%$D@*&8', '!@9#%8', '______'], np.nan)
    
    # Clean Age column (remove strings like '28_', '-500')
    df['Age'] = pd.to_numeric(df['Age'], errors='coerce')
    df = df[df['Age'] > 0]  # Remove invalid ages
    
    # Clean numeric columns
    numeric_cols = ['Annual_Income', 'Monthly_Inhand_Salary', 'Num_Bank_Accounts', 
                   'Num_Credit_Card', 'Interest_Rate', 'Num_of_Loan',
                   'Delay_from_due_date', 'Changed_Credit_Limit', 'Num_Credit_Inquiries',
                   'Outstanding_Debt', 'Credit_Utilization_Ratio', 'Total_EMI_per_month',
                   'Amount_invested_monthly', 'Monthly_Balance']
    
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Handle Num_of_Delayed_Payment (has strings like '8_')
    if 'Num_of_Delayed_Payment' in df.columns:
        df['Num_of_Delayed_Payment'] = df['Num_of_Delayed_Payment'].astype(str).str.replace('_', '')
        df['Num_of_Delayed_Payment'] = pd.to_numeric(df['Num_of_Delayed_Payment'], errors='coerce')
    
    # Parse Credit_History_Age (e.g., "22 Years and 1 Months")
    if 'Credit_History_Age' in df.columns:
        df['Credit_History_Age_Months'] = df['Credit_History_Age'].apply(parse_credit_history_age)
    
    # Fill missing values with median for numeric columns
    for col in numeric_cols + ['Num_of_Delayed_Payment', 'Credit_History_Age_Months']:
        if col in df.columns:
            df[col].fillna(df[col].median(), inplace=True)
    
    # Drop rows with missing target
    df = df.dropna(subset=['Credit_Score'])
    
    print(f"Data cleaned. Shape: {df.shape}")
    return df

def parse_credit_history_age(value):
    """Parse credit history age string to months."""
    if pd.isna(value) or value == 'NA':
        return 0
    try:
        parts = str(value).split(' ')
        years = int(parts[0]) if len(parts) > 0 else 0
        months = int(parts[3]) if len(parts) > 3 else 0
        return years * 12 + months
    except:
        return 0

def engineer_features(df):
    """Engineer features for the model."""
    print("Engineering features...")
    
    # Component P: Payment Consistency (0-100)
    df['Payment_Consistency'] = 100 - np.clip(
        (df['Delay_from_due_date'] * 2) + (df['Num_of_Delayed_Payment'] * 3), 0, 100
    )
    
    # Component I: Income Reliability (0-100)
    df['Income_Reliability'] = np.clip(
        (df['Annual_Income'] / 100000 * 50) + 
        ((df['Monthly_Inhand_Salary'] / (df['Annual_Income'] / 12)) * 50),
        0, 100
    )
    
    # Component T: Transaction Patterns (0-100)
    df['EMI_Ratio'] = df['Total_EMI_per_month'] / (df['Monthly_Inhand_Salary'] + 1)
    df['Investment_Ratio'] = df['Amount_invested_monthly'] / (df['Monthly_Inhand_Salary'] + 1)
    df['Transaction_Patterns'] = np.clip(
        (1 - df['EMI_Ratio']) * 40 + (df['Investment_Ratio'] * 100) * 0.3 + 
        (50 - df['Num_Credit_Inquiries'] * 5),
        0, 100
    )
    
    # Component S: Savings Stability (0-100)
    df['Balance_Ratio'] = df['Monthly_Balance'] / (df['Monthly_Inhand_Salary'] + 1)
    df['Savings_Stability'] = np.clip(
        (df['Balance_Ratio'] * 50) + (50 - df['Credit_Utilization_Ratio']),
        0, 100
    )
    
    # Debt to Income Ratio
    df['Debt_to_Income'] = df['Outstanding_Debt'] / (df['Annual_Income'] + 1)
    
    # Account diversity
    df['Total_Accounts'] = df['Num_Bank_Accounts'] + df['Num_Credit_Card']
    
    return df

def prepare_features(df):
    """Select and prepare features for training."""
    print("Preparing features...")
    
    # Select features for the model
    feature_cols = [
        'Age', 'Annual_Income', 'Monthly_Inhand_Salary', 'Monthly_Balance',
        'Num_Bank_Accounts', 'Num_Credit_Card', 'Interest_Rate', 'Num_of_Loan',
        'Delay_from_due_date', 'Num_of_Delayed_Payment', 'Num_Credit_Inquiries',
        'Credit_Utilization_Ratio', 'Credit_History_Age_Months',
        'Total_EMI_per_month', 'Amount_invested_monthly', 'Outstanding_Debt',
        'Payment_Consistency', 'Income_Reliability', 'Transaction_Patterns',
        'Savings_Stability', 'Debt_to_Income', 'Total_Accounts'
    ]
    
    # Ensure all features exist
    available_features = [col for col in feature_cols if col in df.columns]
    
    X = df[available_features]
    y = df['Credit_Score']
    
    return X, y, available_features

def train_model(X_train, y_train):
    """Train Random Forest model."""
    print("Training Random Forest model...")
    
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    
    model.fit(X_train, y_train)
    
    print("Model training completed!")
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance."""
    print("\nEvaluating model...")
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    return accuracy

def save_model(model, scaler, feature_names):
    """Save trained model and preprocessing objects."""
    print("Saving model...")
    
    # Create output directory
    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    
    # Save model
    with open(MODEL_OUTPUT_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    # Save scaler
    with open(SCALER_OUTPUT_PATH, 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature names and metadata
    metadata = {
        'feature_names': feature_names,
        'model_version': 'v1.0',
        'training_date': pd.Timestamp.now().strftime('%Y-%m-%d')
    }
    
    with open(ENCODERS_OUTPUT_PATH, 'wb') as f:
        pickle.dump(metadata, f)
    
    print(f"Model saved to {MODEL_OUTPUT_PATH}")

def main():
    """Main training pipeline."""
    print("=" * 60)
    print("ScoreBridge ML Model Training")
    print("=" * 60)
    
    # Create model directory if it doesn't exist
    model_dir = os.path.join(SCRIPT_DIR, 'model')
    os.makedirs(model_dir, exist_ok=True)
    print(f"Model directory: {model_dir}")
    
    # Load data
    print(f"\nLoading data from {TRAIN_DATA_PATH}...")
    df = pd.read_csv(TRAIN_DATA_PATH)
    print(f"Data loaded. Shape: {df.shape}")
    
    # Clean data
    df = clean_data(df)
    
    # Engineer features
    df = engineer_features(df)
    
    # Prepare features
    X, y, feature_names = prepare_features(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain set: {X_train.shape}, Test set: {X_test.shape}")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = train_model(X_train_scaled, y_train)
    
    # Evaluate model
    evaluate_model(model, X_test_scaled, y_test)
    
    # Save model
    save_model(model, scaler, feature_names)
    
    print("\n" + "=" * 60)
    print("Training completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
