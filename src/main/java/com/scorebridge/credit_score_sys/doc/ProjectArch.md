### The Need for Machine Learning (ML) in ScoreBridge

In traditional systems, credit scoring rules are static and manually defined. The ScoreBridge project aims to be more dynamic, fair, and accurate by analyzing complex behavioral patterns. This is where Machine Learning is essential.

**Note**: This is a **hackathon project** designed for an interactive demo. The primary feature is a form where users can input their financial data and receive an instant credit score, showcasing the model's logic without requiring real financial data connections.

The core of your project is the **ScoreBridge Index (SBI)** formula:

**SBI = αP + βI + γT + δS**

Here, the variables P, I, T, and S represent different financial behaviors, but the most important part is the weights: **α, β, γ, and δ**. These weights determine how much influence each behavior has on the final score.

The role of the Machine Learning model is to **determine the optimal values for these weights**.

1.  **Finding Complex Patterns**: An ML model can analyze thousands of data points and identify non-obvious relationships between a user's financial behavior and their actual reliability.
2.  **Optimizing for Fairness**: A key goal is to reduce bias. The ML model can be trained to assign weights in a way that provides a fair assessment across different groups, including freelancers, gig workers, and the underbanked.
3.  **Adaptability**: An ML model can be periodically retrained on new data to adapt to new trends, ensuring the ScoreBridge Index remains relevant and accurate.

In short, the ML model doesn't just calculate the score; it **creates the scoring logic itself** by finding the most predictive and fair weights based on real-world data.

---

### Full Backend Architecture and File Descriptions

This modular monolithic architecture is designed for scalability and clear separation of concerns.

#### **Project Root**
```
scorebridge-backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── scorebridge/
                    ├── user/
                    ├── data_ingestion/
                    ├── scoring/
                    └── common/
```

---

### 1. User Module

**Description**: This module handles optional user account creation. It allows a user to save their financial profile and score history after an interactive calculation.

```
user/
├── config/
│   └── SecurityConfig.java         # Configures web security, password hashing, and endpoint authorization for registered users.
├── controller/
│   └── UserController.java         # Defines API endpoints like /register and /login for user account management.
├── dto/
│   ├── UserRegistrationRequest.java  # DTO for capturing user information during sign-up.
│   ├── UserLoginRequest.java         # DTO for capturing credentials during login.
│   └── UserProfileResponse.java      # DTO for sending sanitized user profile data back to a logged-in user.
├── exception/
│   ├── UserNotFoundException.java      # Custom exception for when an operation targets a user that does not exist.
│   └── InvalidCredentialsException.java# Custom exception for failed login attempts.
├── model/
│   └── User.java                 # JPA entity mapping to the `users` table.
├── repository/
│   └── UserRepository.java       # JPA interface for all database operations on the User entity.
└── service/
    └── UserService.java          # Contains business logic for user creation and authentication.
```

---

### 2. Data Ingestion Module

**Description**: This module is responsible for **saving** a user's manually entered financial profile to the database. Its primary role is to persist the data submitted through the interactive form for registered users who want to view their history.

```
data_ingestion/
├── controller/
│   └── DataIngestionController.java# Defines API endpoint (`POST /api/profiles`) to save a user's financial profile.
├── dto/
│   └── FinancialProfileRequest.java    # DTO that captures the complete set of user-submitted financial data from the form for saving.
├── exception/
│   └── DataValidationException.java      # Custom exception for data that fails validation rules before saving.
├── model/
│   ├── FinancialAccount.java         # JPA entity representing user-provided account information.
│   └── FinancialTransaction.java     # JPA entity representing manually entered transactions.
├── repository/
│   ├── FinancialAccountRepository.java # JPA repository for database operations on FinancialAccount.
│   └── FinancialTransactionRepository.java # JPA repository for database operations on FinancialTransaction.
└── service/
    └── DataIngestionService.java   # Implements the logic for validating and persisting a user's financial profile to the database.
```

---

### 3. Scoring Module

**Description**: This is the analytical core of the application. It provides an interactive endpoint to calculate a score instantly from form data and can also score saved profiles for registered users. It orchestrates communication with the ML Model Service.

```
scoring/
├── config/
│   └── MlModelConfig.java        # Contains configuration (e.g., API endpoint URL) for connecting to the ML model service.
├── controller/
│   └── ScoringController.java      # Defines API endpoints, including the primary `POST /api/score/interactive` for instant form-based scoring.
├── dto/
│   ├── InteractiveScoreRequest.java  # DTO containing all financial data submitted from the user form for an immediate score calculation.
│   └── ScoreCalculationResponse.java # DTO to return the final calculated SBI score to the client.
├── exception/
│   └── ScoringModelException.java    # Custom exception for failures during communication with the ML model.
├── model/
│   └── CreditScore.java          # JPA entity mapping to the `credit_scores` table, storing historical results for registered users.
├── repository/
│   └── CreditScoreRepository.java    # JPA repository for saving and retrieving CreditScore records.
├── service/
│   ├── ScoringService.java       # Orchestrates the scoring process, either from an interactive request or from saved data.
│   └── MlModelClient.java        # A dedicated client service for making HTTP requests to the ML model.
└── validation/
    └── ScoreDataValidator.java     # A utility to validate incoming financial data from the form before scoring.
```

---

### 4. Common Module

**Description**: This module contains shared utilities, configurations, and common functionality used across all other modules. It ensures code reusability and maintains consistent behavior throughout the application.

```
common/
├── config/
│   └── GlobalConfig.java           # Application-wide configuration settings.
├── exception/
│   ├── GlobalExceptionHandler.java # Centralized exception handling for all modules.
│   └── BusinessException.java      # Base exception class for business logic errors.
├── util/
│   ├── DateUtils.java             # Date formatting and manipulation utilities.
│   ├── ValidationUtils.java       # Common validation helper methods.
│   └── ResponseBuilder.java       # Standardized API response builder.
└── dto/
    └── ApiResponse.java           # Generic DTO for consistent API responses.
```

---

### Database Schema and Tables

The database is designed to support the optional saving of user profiles and scores.

#### `users`
Stores optional user account information.

| Column Name     | Data Type      | Constraints                     | Description                                |
| :-------------- | :------------- | :------------------------------ | :----------------------------------------- |
| `id`            | `BIGINT`       | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier for the user.            |
| `uuid`          | `VARCHAR(36)`  | `UNIQUE`, `NOT NULL`            | Publicly exposed unique identifier.        |
| `full_name`     | `VARCHAR(255)` | `NOT NULL`                      | The user's full name.                      |
| `email`         | `VARCHAR(255)` | `UNIQUE`, `NOT NULL`            | The user's email address for login.        |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                      | Hashed password for security.              |
| `created_at`    | `TIMESTAMP`    | `NOT NULL`                      | Timestamp of user registration.            |
| `updated_at`    | `TIMESTAMP`    | `NOT NULL`                      | Timestamp of the last profile update.      |

#### `financial_accounts`
Stores information about user-provided financial accounts (manually entered).

| Column Name            | Data Type        | Constraints                     | Description                                                |
| :--------------------- | :--------------- | :------------------------------ | :--------------------------------------------------------- |
| `id`                   | `BIGINT`         | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier for the account.                         |
| `user_id`              | `BIGINT`         | `FOREIGN KEY (users.id)`        | Links to the user who owns this account.                   |
| `institution_name`     | `VARCHAR(255)`   | `NOT NULL`                      | Name of the financial institution (manually entered).      |
| `account_type`         | `VARCHAR(50)`    | `NOT NULL`                      | Type of account (e.g., checking, savings, credit card).    |
| `account_number_last4` | `VARCHAR(4)`     |                                 | Last 4 digits of the account (optional, for user reference). |
| `current_balance`      | `DECIMAL(10, 2)` |                                 | Current balance in the account (manually entered).         |
| `created_at`           | `TIMESTAMP`      | `NOT NULL`                      | Timestamp when the account was added.                      |
| `updated_at`           | `TIMESTAMP`      | `NOT NULL`                      | Timestamp of the last update.                              |

#### `financial_transactions`
Stores individual transactions manually entered by users.

| Column Name        | Data Type        | Constraints                     | Description                                                          |
| :----------------- | :--------------- | :------------------------------ | :------------------------------------------------------------------- |
| `id`               | `BIGINT`         | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier for the transaction.                               |
| `account_id`       | `BIGINT`         | `FOREIGN KEY (financial_accounts.id)`| Links to the financial account.                                      |
| `amount`           | `DECIMAL(10, 2)` | `NOT NULL`                      | The transaction amount (positive for income, negative for expenses). |
| `category`         | `VARCHAR(100)`   | `NOT NULL`                      | Category of the transaction (e.g., Rent, Salary, Utilities).       |
| `description`      | `VARCHAR(255)`   |                                 | Optional transaction description provided by the user.             |
| `transaction_type` | `VARCHAR(20)`    | `NOT NULL`                      | Type: 'INCOME' or 'EXPENSE'.                                         |
| `transaction_date` | `DATE`           | `NOT NULL`                      | The date the transaction occurred.                                   |
| `created_at`       | `TIMESTAMP`      | `NOT NULL`                      | Timestamp when the record was created.                               |

#### `credit_scores`
Stores the calculated ScoreBridge Index (SBI) for each registered user over time.

| Column Name   | Data Type     | Constraints                     | Description                                                  |
| :------------ | :------------ | :------------------------------ | :----------------------------------------------------------- |
| `id`          | `BIGINT`      | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier for the score record.                      |
| `user_id`     | `BIGINT`      | `FOREIGN KEY (users.id)`        | Links to the user.                                           |
| `sbi_score`   | `INT`         | `NOT NULL`                      | The calculated ScoreBridge Index.                            |
| `component_p` | `FLOAT`       |                                 | Value for Payment consistency factor.                        |
| `component_i` | `FLOAT`       |                                 | Value for Income reliability factor.                         |
| `component_t` | `FLOAT`       |                                 | Value for Transaction patterns factor.                       |
| `component_s` | `FLOAT`       |                                 | Value for Savings stability factor.                          |
| `model_version`| `VARCHAR(50)` |                                 | Version of the ML model used.                                |
| `calculated_at`| `TIMESTAMP`   | `NOT NULL`                      | Timestamp when the score was calculated.                     |

---

### API Endpoints Summary

#### User Module Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/profile` - Get current user profile (requires authentication)
- `POST /api/auth/logout` - Logout and invalidate token

#### Data Ingestion Module Endpoints
- `POST /api/data/profile` - Save financial profile for authenticated user
- `GET /api/data/accounts` - Retrieve user's financial accounts
- `GET /api/data/transactions` - Retrieve user's transaction history

#### Scoring Module Endpoints
- `POST /api/score/calculate` - Calculate SBI score (with or without authentication)
- `GET /api/score/history` - Get user's score calculation history (requires authentication)
- `GET /api/score/latest` - Get user's most recent score (requires authentication)

---

### Machine Learning Integration

The scoring module communicates with a separate Python-based ML service running on Flask. The ML service:

1. **Receives** raw financial data from the Spring Boot backend
2. **Performs** feature engineering and data preprocessing
3. **Applies** the trained logistic regression model
4. **Returns** the calculated SBI score and component values

**ML Model Architecture:**
- Algorithm: Logistic Regression with optimized weights
- Features: 20+ engineered financial behavior metrics
- Training Data: Synthetic dataset based on financial best practices
- Model Version: Tracked in database for reproducibility

**Communication Flow:**
```
Spring Boot (ScoringService) 
    → HTTP POST request to Flask ML API
    → Flask processes data and runs model
    → Returns JSON with score and components
    → Spring Boot stores result and returns to frontend
```

---

### Security Considerations

1. **Authentication**: JWT-based stateless authentication
2. **Password Storage**: Bcrypt hashing with salt
3. **Input Validation**: Bean Validation on all DTOs
4. **SQL Injection Protection**: JPA with parameterized queries
5. **CORS Configuration**: Restricted to frontend origin only
6. **API Rate Limiting**: Future enhancement for production

---

### Deployment Notes

**⚠️ HACKATHON CONFIGURATION - NOT PRODUCTION READY**

This application uses an **in-memory H2 database** suitable only for:
- Local development
- Hackathon demonstrations
- Quick prototyping

**For Production Deployment:**
1. Replace H2 with PostgreSQL or MySQL
2. Implement proper environment-based configuration
3. Add API rate limiting and monitoring
4. Set up centralized logging (ELK stack)
5. Configure SSL/TLS for all endpoints
6. Implement database migrations (Flyway/Liquibase)
7. Add comprehensive integration tests
8. Set up CI/CD pipeline (GitHub Actions, Jenkins)
9. Containerize with Docker and orchestrate with Kubernetes
10. Implement backup and disaster recovery procedures