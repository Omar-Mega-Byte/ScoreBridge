# Data Ingestion Module

## Overview

The Data Ingestion Module is responsible for managing user-submitted financial data in the ScoreBridge Credit Score System. This module handles the collection, validation, storage, and retrieval of financial accounts and transactions for registered users.

## Architecture

### Package Structure

```
data_ingestion/
├── config/
│   └── DataIngestionExceptionHandler.java
├── controller/
│   └── DataIngestionController.java
├── dto/
│   ├── FinancialAccountDto.java
│   ├── FinancialProfileRequest.java
│   ├── FinancialProfileResponse.java
│   └── TransactionDto.java
├── exception/
│   ├── AccountNotFoundException.java
│   ├── DataIngestionException.java
│   └── DataValidationException.java
├── model/
│   ├── FinancialAccount.java
│   └── FinancialTransactions.java
├── repository/
│   ├── FinancialAccountRepository.java
│   └── FinancialTransactionRepository.java
├── service/
│   └── DataIngestionService.java
└── validation/
    └── FinancialDataValidator.java
```

## Features

### 1. Financial Profile Management
- **Save Complete Profile**: Users can submit their entire financial profile including multiple accounts and transactions
- **User Association**: Each profile is linked to a registered user for tracking and history
- **Transactional Safety**: All operations are wrapped in database transactions

### 2. Account Management
- **CRUD Operations**: Create, Read, Update, and Delete financial accounts
- **Multiple Account Types**: Support for checking, savings, credit cards, and investment accounts
- **Balance Tracking**: Store current balance for each account

### 3. Transaction Management
- **Income & Expenses**: Track both income and expense transactions
- **Categorization**: Organize transactions by predefined categories
- **Date Tracking**: Record transaction dates for analysis
- **Bulk Operations**: Save multiple transactions at once

### 4. Data Validation
- **Comprehensive Validation**: Validate all input data before saving
- **Business Rules**: Enforce limits on accounts per user, transactions per account, etc.
- **Error Reporting**: Provide detailed error messages for validation failures

### 5. Exception Handling
- **Custom Exceptions**: Specific exceptions for different error scenarios
- **Global Handler**: Centralized exception handling with appropriate HTTP status codes
- **Logging**: All errors are logged for debugging and monitoring

## API Endpoints

### Save Financial Profile
```http
POST /api/data/profiles
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "accounts": [
    {
      "institutionName": "Chase Bank",
      "accountType": "checking",
      "accountNumberLast4": "1234",
      "currentBalance": 5000.00,
      "transactions": [
        {
          "amount": 3000.00,
          "transactionType": "INCOME",
          "category": "Salary",
          "description": "Monthly salary",
          "transactionDate": "2025-10-01"
        }
      ]
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "userId": 1,
  "accountIds": [1],
  "totalAccounts": 1,
  "totalTransactions": 1,
  "totalBalance": 5000.00,
  "savedAt": "2025-10-10T10:30:00",
  "message": "Financial profile saved successfully"
}
```

### Get User Accounts
```http
GET /api/data/users/{userId}/accounts
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institutionName": "Chase Bank",
    "accountType": "checking",
    "accountNumberLast4": "1234",
    "currentBalance": 5000.00,
    "createdAt": "2025-10-10T10:30:00",
    "updatedAt": "2025-10-10T10:30:00"
  }
]
```

### Get Account by ID
```http
GET /api/data/accounts/{accountId}
Authorization: Bearer {token}
```

### Get Account Transactions
```http
GET /api/data/accounts/{accountId}/transactions
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "amount": 3000.00,
    "transactionType": "INCOME",
    "category": "Salary",
    "description": "Monthly salary",
    "transactionDate": "2025-10-01",
    "createdAt": "2025-10-10T10:30:00"
  }
]
```

### Update Account
```http
PUT /api/data/accounts/{accountId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "institutionName": "Chase Bank",
  "accountType": "checking",
  "accountNumberLast4": "1234",
  "currentBalance": 5500.00
}
```

### Delete Account
```http
DELETE /api/data/accounts/{accountId}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null
}
```

## Validation Rules

### Account Validation
- **Institution Name**: Required, max 255 characters
- **Account Type**: Must be one of: checking, savings, credit_card, investment
- **Account Number Last 4**: Optional, must be exactly 4 digits if provided
- **Current Balance**: Required, must be non-negative, max $10,000,000
- **Max Accounts per User**: 20 accounts

### Transaction Validation
- **Amount**: Required, must be > 0, max $1,000,000
- **Transaction Type**: Required, must be INCOME or EXPENSE
- **Category**: Required, must be from predefined list, max 100 characters
- **Description**: Optional, max 255 characters
- **Transaction Date**: Required, must be between 1 year ago and today
- **Max Transactions per Account**: 1,000 transactions

### Supported Categories

**Income Categories:**
- Salary
- Wages
- Freelance
- Investment Income
- Rental Income
- Other Income

**Expense Categories:**
- Rent
- Mortgage
- Utilities
- Groceries
- Dining
- Transportation
- Entertainment
- Healthcare
- Insurance
- Education
- Shopping
- Travel
- Subscriptions
- Debt Payment
- Savings
- Other Expense

## Database Schema

### financial_accounts Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT | FOREIGN KEY (users.id), NOT NULL |
| institution_name | VARCHAR(255) | NOT NULL |
| account_type | VARCHAR(50) | NOT NULL |
| account_number_last4 | VARCHAR(4) | NULLABLE |
| current_balance | DECIMAL(10,2) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### financial_transactions Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| account_id | BIGINT | FOREIGN KEY (financial_accounts.id), NOT NULL |
| amount | DECIMAL(10,2) | NOT NULL |
| transaction_type | VARCHAR(20) | NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| description | VARCHAR(255) | NULLABLE |
| transaction_date | DATE | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

## Error Handling

### Exception Types

1. **DataValidationException** (400 Bad Request)
   - Thrown when input data fails validation rules
   - Contains detailed error messages about what failed

2. **AccountNotFoundException** (404 Not Found)
   - Thrown when trying to access a non-existent account
   - Contains the account ID that wasn't found

3. **DataIngestionException** (500 Internal Server Error)
   - Thrown when data processing or persistence fails
   - Contains the underlying error message

### Example Error Response
```json
{
  "success": false,
  "message": "Validation failed: Account #1: Current balance cannot be negative",
  "data": null
}
```

## Usage Examples

### For Registered Users (Hackathon Demo)

1. **User registers an account** via `/api/auth/register`
2. **User logs in** via `/api/auth/login` to get JWT token
3. **User submits financial data** via `/api/data/profiles`
4. **System saves the profile** and returns summary
5. **User can retrieve their data** anytime via GET endpoints
6. **System can use saved data** for credit score calculation

### For Anonymous Users (Instant Scoring)

- Anonymous users can skip the data ingestion module
- They submit data directly to the scoring module
- No data is persisted in the database
- Instant score calculation without registration

## Security

- All endpoints require JWT authentication
- Users can only access their own financial data
- User ID in requests is validated against authenticated user
- Sensitive data is never logged or exposed in error messages

## Integration Points

### With User Module
- Validates user existence before saving profiles
- Links all accounts to authenticated users
- Uses User entity for foreign key relationships

### With Scoring Module
- Provides financial data for credit score calculations
- Scoring module queries this module for user financial history
- Data structure optimized for scoring algorithms

## Best Practices

1. **Always validate user input** before processing
2. **Use transactions** for multi-step operations
3. **Log all errors** but never log sensitive data
4. **Return meaningful error messages** to help users correct issues
5. **Keep validation rules consistent** across all layers
6. **Test with realistic data** to ensure constraints are appropriate

## Future Enhancements

- [ ] Support for CSV file uploads
- [ ] Bulk import from spreadsheets
- [ ] Data export functionality
- [ ] Transaction search and filtering
- [ ] Financial insights and summaries
- [ ] Multi-currency support
- [ ] Recurring transaction detection
- [ ] Budget tracking integration

## Testing

Use the provided Swagger UI to test all endpoints:
- Navigate to `http://localhost:8080/swagger-ui.html`
- Authorize with a valid JWT token
- Test each endpoint with sample data

## Notes

- This module is designed for a hackathon demo
- Production deployment would require additional security measures
- Consider adding rate limiting for API endpoints
- Implement proper audit logging for compliance
- Add data retention policies if storing sensitive information
