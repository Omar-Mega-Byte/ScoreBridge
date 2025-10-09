# User Module

## Overview

The User Module is the authentication and user management component of the ScoreBridge Credit Score System. It handles user registration, login, JWT token management, and secure access control for the application.

## Architecture

### Package Structure

```
user/
├── config/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtUtil.java
│   ├── OpenApiConfig.java
│   └── SecurityConfig.java
├── controller/
│   └── AuthController.java
├── dto/
│   ├── ApiResponse.java
│   ├── JwtResponse.java
│   ├── LoginRequest.java
│   └── RegisterRequest.java
├── exception/
│   ├── InvalidCredentialsException.java
│   ├── InvalidTokenException.java
│   ├── UserAlreadyExistsException.java
│   ├── UserNotFoundException.java
│   └── ValidationException.java
├── model/
│   └── User.java
├── repository/
│   └── UserRepository.java
├── service/
│   ├── AuthService.java
│   └── CustomUserDetailsService.java
└── validation/
    └── UserValidation.java
```

## Features

### 1. User Registration
- **Email-based registration** with validation
- **Password strength requirements** (minimum 8 characters, uppercase, lowercase, digit, special character)
- **Name validation** (2-50 characters)
- **Duplicate email prevention**
- **Automatic password hashing** using BCrypt

### 2. User Authentication
- **JWT-based authentication** (stateless, no sessions)
- **Secure login** with email and password
- **Token generation** with configurable expiration
- **Token refresh** mechanism for extended sessions

### 3. Security Features
- **BCrypt password hashing** (industry-standard)
- **JWT token validation** on protected endpoints
- **Role-based access** (USER role for all authenticated users)
- **CORS configuration** for cross-origin requests
- **Security headers** for protection against common attacks

### 4. Token Management
- **Access tokens** with 24-hour validity
- **Token refresh** without re-entering credentials
- **Token validation** endpoint for client-side checks
- **User information extraction** from tokens

### 5. Input Validation
- **Comprehensive field validation** using Jakarta Bean Validation
- **Custom validation rules** for passwords and emails
- **Detailed error messages** for validation failures
- **Password strength indicator** (Weak, Medium, Strong, Very Strong)

## API Endpoints

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### Validate Token
```http
POST /api/auth/validate
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": null
}
```

## Validation Rules

### Registration Validation

**Name:**
- Required
- Minimum 2 characters
- Maximum 50 characters
- Must contain only letters, spaces, hyphens, and apostrophes

**Email:**
- Required
- Valid email format (RFC 5322 compliant)
- Must be unique in the system
- Maximum 255 characters

**Password:**
- Required
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one digit
- Must contain at least one special character (@$!%*?&#)
- Maximum 100 characters

### Login Validation

**Email:**
- Required
- Valid email format

**Password:**
- Required
- Must match stored password (BCrypt comparison)

## Security Configuration

### JWT Settings
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: Configurable via `application.yml`
- **Token Validity**: 24 hours (86400000 ms)
- **Header**: `Authorization: Bearer {token}`

### Password Security
- **Algorithm**: BCrypt
- **Strength**: 10 rounds (default)
- **Salted**: Yes (automatic with BCrypt)

### CORS Configuration
- **Allowed Origins**: Configurable (default: all)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type
- **Max Age**: 3600 seconds

### Protected Endpoints
All endpoints under `/api/data/**`, `/api/scoring/**`, and `/api/reports/**` require authentication.

## Database Schema

### users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email (login) |
| hashed_password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| created_at | TIMESTAMP | NOT NULL | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `email` for faster lookups

## Error Handling

### Exception Types

1. **UserAlreadyExistsException** (409 Conflict)
   - Thrown when registering with an existing email
   - Message: "User with email {email} already exists"

2. **UserNotFoundException** (404 Not Found)
   - Thrown when user is not found in database
   - Message: "User not found with email: {email}"

3. **InvalidCredentialsException** (401 Unauthorized)
   - Thrown when login credentials are incorrect
   - Message: "Invalid email or password"

4. **InvalidTokenException** (401 Unauthorized)
   - Thrown when JWT token is invalid, expired, or malformed
   - Message: "Invalid or expired token"

5. **ValidationException** (400 Bad Request)
   - Thrown when input validation fails
   - Contains detailed field-level error messages

### Example Error Response
```json
{
  "success": false,
  "message": "User with email john.doe@example.com already exists",
  "data": null
}
```

## Usage Flow

### For New Users

1. **Register** via `POST /api/auth/register`
   - Provide name, email, and strong password
   - Receive JWT token immediately upon successful registration
   
2. **Use Token** for authenticated requests
   - Include token in `Authorization: Bearer {token}` header
   - Token valid for 24 hours

3. **Refresh Token** when needed
   - Use `POST /api/auth/refresh` before token expires
   - Receive new token with extended validity

### For Returning Users

1. **Login** via `POST /api/auth/login`
   - Provide email and password
   - Receive new JWT token

2. **Access Protected Resources**
   - Use token for all API calls
   - Token automatically validated by `JwtAuthenticationFilter`

3. **Handle Token Expiration**
   - Client should handle 401 responses
   - Redirect to login or use refresh token

## Password Strength Levels

The system evaluates password strength with the following criteria:

**Weak** (Score < 2):
- Lacks multiple required character types
- Too short
- Common patterns

**Medium** (Score 2):
- Meets minimum requirements
- 8+ characters with basic complexity

**Strong** (Score 3):
- 10+ characters
- Contains uppercase, lowercase, digits, and special characters
- No common patterns

**Very Strong** (Score 4+):
- 12+ characters
- High complexity
- Uncommon character combinations
- Additional special characters

## Integration Points

### With Data Ingestion Module
- Provides user authentication for saving financial profiles
- User ID links financial accounts to specific users
- Validates user existence before data operations

### With Scoring Module
- Authenticates users requesting score calculations
- Links calculated scores to user accounts
- Enables score history tracking per user

### With Report Module
- Authenticates users requesting credit reports
- Ensures users can only access their own reports
- Links reports to user accounts

## Configuration

### application.yml
```yaml
jwt:
  secret: your-secret-key-min-256-bits
  expiration: 86400000  # 24 hours in milliseconds

spring:
  security:
    user:
      name: admin  # Only used for development
      password: admin  # Only used for development
```

### Security Best Practices

1. **JWT Secret**
   - Use a strong, random secret key (minimum 256 bits)
   - Store in environment variables, not in code
   - Rotate periodically for production

2. **Password Policy**
   - Enforce strong password requirements
   - Consider implementing password expiration
   - Add rate limiting for login attempts

3. **Token Management**
   - Keep token expiration reasonable (24 hours recommended)
   - Implement token blacklisting for logout
   - Use refresh tokens for long-lived sessions

4. **HTTPS**
   - Always use HTTPS in production
   - Tokens transmitted over HTTP are vulnerable
   - Enable HSTS headers

## Testing

### Manual Testing via Swagger UI

1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Find the "Authentication" section
3. Test registration:
   - Click "POST /api/auth/register"
   - Click "Try it out"
   - Enter user details
   - Click "Execute"
4. Copy the JWT token from the response
5. Click "Authorize" at the top
6. Enter: `Bearer {your-token}`
7. Now you can test protected endpoints

### Example Test Data

**Valid User:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Weak Password (will fail):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "weak"
}
```

**Invalid Email (will fail):**
```json
{
  "name": "Test User",
  "email": "not-an-email",
  "password": "TestPass123!"
}
```

## Common Issues & Solutions

### Issue: "JWT secret key too short"
**Solution**: Ensure your JWT secret in `application.yml` is at least 256 bits (32 characters)

### Issue: "Token expired" errors
**Solution**: Use the refresh token endpoint or login again

### Issue: "User already exists" during registration
**Solution**: User with that email is already registered. Use login instead.

### Issue: "Invalid credentials" during login
**Solution**: Check email and password are correct. Password is case-sensitive.

### Issue: CORS errors in browser
**Solution**: Check CORS configuration in `SecurityConfig.java` allows your frontend origin

## Future Enhancements

- [ ] Email verification for new accounts
- [ ] Password reset functionality via email
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub, etc.)
- [ ] Account lockout after failed login attempts
- [ ] Password change functionality
- [ ] User profile management
- [ ] Remember me functionality
- [ ] Session management and logout
- [ ] Audit logging for security events

## Development Guidelines

### Adding New Endpoints

1. Add method to `AuthController`
2. Implement business logic in `AuthService`
3. Add validation in `UserValidation` if needed
4. Create custom exception if needed
5. Update Swagger documentation
6. Test via Swagger UI

### Modifying Security Rules

1. Update `SecurityConfig.java`
2. Modify `JwtAuthenticationFilter` if needed
3. Test authentication flow
4. Update documentation

### Adding User Fields

1. Add field to `User` entity
2. Update `RegisterRequest` DTO
3. Modify `AuthService.registerUser()`
4. Update validation rules
5. Run migration (in production)

## Notes

- This module is designed for a hackathon demo
- Production deployment requires additional security measures:
  - Rate limiting for login attempts
  - Account lockout mechanisms
  - Email verification
  - HTTPS enforcement
  - Token blacklisting for logout
  - Audit logging
  - Database encryption for sensitive fields

## Support

For issues or questions:
- Check the Swagger UI documentation
- Review error messages (they're descriptive!)
- Check application logs
- Verify JWT token format and expiration

---

**Version**: 1.0  
**Last Updated**: October 10, 2025  
**Author**: ScoreBridge Team
