# ScoreBridge Credit Scoring System - Hackathon Project 🚀

**ScoreBridge** is an innovative credit scoring platform that uses machine learning to provide fair, transparent, and accurate credit assessments. Built for hackathon demonstration, it features an interactive form-based scoring system powered by the **ScoreBridge Index (SBI)** formula.

## 🌟 Features

- **Interactive Credit Score Calculator**: Get instant credit scores without registration
- **ML-Powered Predictions**: Random Forest model trained on 100K+ data points
- **Component Breakdown**: View P, I, T, S components that make up your score
- **Personalized Recommendations**: Receive actionable advice to improve your score
- **Score History**: Registered users can track their progress over time
- **RESTful API**: Well-documented Swagger UI for easy integration
- **Fallback Mechanism**: Continues working even if ML service is down

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│  Frontend Form  │────────▶│  Spring Boot API │────────▶│  Python ML API │
│   (Web/Mobile)  │         │   (Port 8080)    │         │  (Port 5000)   │
└─────────────────┘         └──────────────────┘         └────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   H2 Database    │
                            │   (In-Memory)    │
                            └──────────────────┘
```

## 📊 ScoreBridge Index (SBI) Formula

```
SBI = αP + βI + γT + δS
```

- **P (Payment Consistency)**: Payment delays, delayed payments history
- **I (Income Reliability)**: Income stability, salary consistency
- **T (Transaction Patterns)**: EMI management, investment habits
- **S (Savings Stability)**: Monthly balance, credit utilization

**Weights** (learned by ML model):
- α = 0.35, β = 0.25, γ = 0.20, δ = 0.20

**Score Range**: 300-850 (Poor to Excellent)

## 🚀 Quick Start

### Prerequisites

- **Java 21** (OpenJDK or Oracle JDK)
- **Maven 3.8+**
- **Python 3.8+**
- **pip** (Python package manager)

### Setup & Run

#### 1. Clone the Repository

```bash
git clone https://github.com/shahdkh2288/ScoreBridge_HackNomics.git
cd credit_score_sys
```

#### 2. Start the ML Service

```bash
cd ml_service

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (first time only, ~2-3 minutes)
python train_model.py

# Start the Flask API
python app.py
```

Expected output:
```
INFO:__main__:Loading model files...
INFO:__main__:Model loaded successfully
INFO:__main__:Starting Flask API server on http://localhost:5000
```

#### 3. Start the Spring Boot Application

Open a new terminal:

```bash
# Build and run with Maven
mvn clean install
mvn spring-boot:run
```

Or run directly:
```bash
mvn spring-boot:run
```

Expected output:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.3.5)

...
INFO: Started CreditScoreSysApplication in 5.234 seconds
```

#### 4. Access the Application

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console
- **API Base**: http://localhost:8080/api

## 📝 API Usage Examples

### Calculate Credit Score (Anonymous)

```bash
curl -X POST http://localhost:8080/api/score/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "annualIncome": 50000.0,
    "monthlySalary": 3500.0,
    "monthlyBalance": 2500.0,
    "numBankAccounts": 3,
    "numCreditCards": 2,
    "interestRate": 5.5,
    "numLoans": 2,
    "delayFromDueDate": 3,
    "numDelayedPayments": 2,
    "numCreditInquiries": 4,
    "creditUtilizationRatio": 30.5,
    "creditHistoryAgeMonths": 60,
    "totalEmiPerMonth": 500.0,
    "amountInvestedMonthly": 200.0,
    "outstandingDebt": 5000.0
  }'
```

### Response

```json
{
  "success": true,
  "message": "Score calculated successfully",
  "data": {
    "sbiScore": 720,
    "scoreCategory": "Very Good",
    "components": {
      "paymentConsistency": 85.5,
      "incomeReliability": 72.3,
      "transactionPatterns": 68.9,
      "savingsStability": 91.2,
      "alphaWeight": 0.35,
      "betaWeight": 0.25,
      "gammaWeight": 0.20,
      "deltaWeight": 0.20
    },
    "riskLevel": "Low Risk",
    "explanation": "Great! Your ScoreBridge Index of 720 is in the 'Very Good' range...",
    "recommendations": "• Excellent! Maintain your current financial habits...",
    "calculatedAt": "2025-10-12T14:30:45",
    "modelVersion": "v1.0",
    "saved": false,
    "confidenceLevel": 92.5
  }
}
```

### Get Score History (Registered Users)

```bash
curl -X GET http://localhost:8080/api/score/history/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗂️ Project Structure

```
credit_score_sys/
├── src/main/java/com/scorebridge/credit_score_sys/
│   ├── modules/
│   │   ├── user/              # User authentication & management
│   │   ├── data_ingestion/    # Financial data persistence
│   │   ├── scoring/           # ✨ Credit scoring engine
│   │   │   ├── controller/    # REST API endpoints
│   │   │   ├── service/       # Business logic
│   │   │   ├── repository/    # Database access
│   │   │   ├── dto/           # Data transfer objects
│   │   │   ├── model/         # JPA entities
│   │   │   ├── exception/     # Custom exceptions
│   │   │   └── config/        # Configuration
│   │   └── common/            # Shared utilities
│   └── resources/
│       └── application.yml    # Application configuration
├── ml_service/
│   ├── app.py                 # Flask ML API
│   ├── train_model.py         # Model training script
│   ├── requirements.txt       # Python dependencies
│   ├── model/                 # Trained models (generated)
│   └── README.md              # ML service documentation
├── pom.xml                    # Maven dependencies
└── README.md                  # This file
```

## 🔑 Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/score/calculate` | Calculate credit score | No |
| GET | `/api/score/history/{userId}` | Get score history | Yes |
| GET | `/api/score/latest/{userId}` | Get latest score | Yes |
| GET | `/api/score/health` | Health check | No |

## 🎯 Input Fields for Scoring

### Required Fields (16 total)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| age | Integer | User's age (18-100) | 28 |
| annualIncome | Double | Annual income in USD | 50000.00 |
| monthlySalary | Double | Monthly in-hand salary | 3500.00 |
| monthlyBalance | Double | Current monthly balance | 2500.00 |
| numBankAccounts | Integer | Number of bank accounts | 3 |
| numCreditCards | Integer | Number of credit cards | 2 |
| interestRate | Double | Average interest rate (%) | 5.5 |
| numLoans | Integer | Number of active loans | 2 |
| delayFromDueDate | Integer | Avg days delay from due date | 3 |
| numDelayedPayments | Integer | Delayed payments (12 months) | 2 |
| numCreditInquiries | Integer | Credit inquiries (6 months) | 4 |
| creditUtilizationRatio | Double | Credit utilization (%) | 30.5 |
| creditHistoryAgeMonths | Integer | Credit history in months | 60 |
| totalEmiPerMonth | Double | Total EMI per month | 500.00 |
| amountInvestedMonthly | Double | Monthly investment amount | 200.00 |
| outstandingDebt | Double | Total outstanding debt | 5000.00 |

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Test with Swagger UI

1. Navigate to http://localhost:8080/swagger-ui.html
2. Find the "Scoring" section
3. Try out `/api/score/calculate` endpoint
4. Click "Try it out" and modify the example JSON
5. Click "Execute"

## 🛠️ Technologies Used

### Backend (Java)
- Spring Boot 3.3.5
- Spring Security + JWT
- Spring Data JPA
- H2 Database
- WebFlux (for ML service calls)
- Lombok
- Swagger/OpenAPI

### ML Service (Python)
- Flask 3.0.0
- Scikit-learn 1.3.2
- Pandas 2.1.3
- NumPy 1.26.2

## 📈 ML Model Performance

- **Algorithm**: Random Forest Classifier
- **Training Data**: 100,000+ records
- **Accuracy**: ~85%
- **Features**: 22 engineered features
- **Training Time**: ~2-3 minutes
- **Prediction Time**: <100ms

## 🔧 Configuration

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    
ml:
  service:
    url: http://localhost:5000
    timeout-seconds: 10
    fallback-enabled: true
    
jwt:
  secret: your-secret-key
  expiration: 86400000  # 24 hours
```

## 🚨 Troubleshooting

### ML Service not responding
- Check if Python service is running on port 5000
- The system has a fallback mechanism and will still work

### Port already in use
```bash
# Change port in application.yml
server:
  port: 8081
```

### Model not found
```bash
cd ml_service
python train_model.py
```

### Database issues
- Delete `data/` folder (H2 will recreate)
- Or use H2 console to inspect: http://localhost:8080/h2-console

## 👥 Team

**ScoreBridge Team** - Hackathon Project 2025

## 📜 License

This is a hackathon project for demonstration purposes.

## 🎉 Demo Tips

1. **Start ML service first** - It needs to train the model
2. **Use Swagger UI** - Best way to demo the API
3. **Show the formula** - Explain the P, I, T, S components
4. **Highlight fallback** - Works even if ML service is down
5. **Show recommendations** - Personalized advice feature
6. **Demo score history** - For registered users

## 📞 Support

For issues or questions during the hackathon, check:
- Swagger UI: http://localhost:8080/swagger-ui.html
- ML Service Health: http://localhost:5000/health
- H2 Console: http://localhost:8080/h2-console

---

**Built with ❤️ for HackNomics 2025** 🏆
