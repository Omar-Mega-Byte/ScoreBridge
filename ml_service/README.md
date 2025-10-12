# ScoreBridge ML Service

Python-based machine learning service for credit score prediction.

## Setup

### 1. Install Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python train_model.py
```

This will:
- Load and clean the training data from `train.csv`
- Engineer features (P, I, T, S components)
- Train a Random Forest classifier
- Save the model to `model/credit_score_model.pkl`

Expected output:
```
==============================================================
ScoreBridge ML Model Training
==============================================================

Loading data from src/main/java/com/scorebridge/credit_score_sys/modules/scoring/ml/train.csv...
Data loaded. Shape: (100002, 28)
Cleaning data...
Data cleaned. Shape: (99750, 28)
...
Accuracy: 0.8523
Model saved to ml_service/model/credit_score_model.pkl
==============================================================
Training completed successfully!
==============================================================
```

### 3. Start the API Service

```bash
python app.py
```

The Flask API will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "v1.0"
}
```

### Predict Credit Score
```
POST /predict
Content-Type: application/json
```

Request Body:
```json
{
  "age": 28,
  "annualIncome": 50000.0,
  "monthlyInhandSalary": 3500.0,
  "monthlyBalance": 2500.0,
  "numBankAccounts": 3,
  "numCreditCard": 2,
  "interestRate": 5.5,
  "numOfLoan": 2,
  "delayFromDueDate": 3,
  "numOfDelayedPayment": 2,
  "numCreditInquiries": 4,
  "creditUtilizationRatio": 30.5,
  "creditHistoryAgeMonths": 60,
  "totalEmiPerMonth": 500.0,
  "amountInvestedMonthly": 200.0,
  "outstandingDebt": 5000.0
}
```

Response:
```json
{
  "predictedScore": 720,
  "scoreCategory": "Very Good",
  "paymentConsistency": 85.5,
  "incomeReliability": 72.3,
  "transactionPatterns": 68.9,
  "savingsStability": 91.2,
  "alphaWeight": 0.35,
  "betaWeight": 0.25,
  "gammaWeight": 0.20,
  "deltaWeight": 0.20,
  "modelVersion": "v1.0",
  "confidenceLevel": 92.5
}
```

## Model Details

### ScoreBridge Index (SBI) Formula

```
SBI = αP + βI + γT + δS
```

Where:
- **P (Payment Consistency)**: Based on payment delays and history
- **I (Income Reliability)**: Based on income stability and levels
- **T (Transaction Patterns)**: Based on EMI management and investments
- **S (Savings Stability)**: Based on balance and credit utilization

Weights (α, β, γ, δ) are optimized by the ML model:
- α = 0.35 (Payment Consistency)
- β = 0.25 (Income Reliability)
- γ = 0.20 (Transaction Patterns)
- δ = 0.20 (Savings Stability)

### Score Range: 300-850

- 750-850: Excellent
- 700-749: Very Good
- 650-699: Good
- 600-649: Fair
- 300-599: Poor

## Troubleshooting

### Model files not found
Run `python train_model.py` first to generate the model files.

### Import errors
Ensure all dependencies are installed: `pip install -r requirements.txt`

### Port already in use
Change the port in `app.py` or stop the process using port 5000.
