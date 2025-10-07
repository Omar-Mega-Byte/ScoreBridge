package com.scorebridge.credit_score_sys.modules.user.validation;

import com.scorebridge.credit_score_sys.modules.user.dto.LoginRequest;
import com.scorebridge.credit_score_sys.modules.user.dto.RegisterRequest;
import com.scorebridge.credit_score_sys.modules.user.exception.ValidationException;
import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

/**
 * Validation component for user-related operations.
 * Provides comprehensive validation for user registration, login, and data
 * fields.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Component
public class UserValidation {

    /**
     * Pattern for validating email addresses.
     * Accepts standard email format with alphanumeric characters and common
     * symbols.
     */
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    /**
     * Pattern for validating user names.
     * Accepts 2-50 characters, letters and spaces only.
     */
    private static final Pattern NAME_PATTERN = Pattern.compile(
            "^[A-Za-z ]{2,50}$");

    /**
     * Pattern for validating passwords.
     * Requires at least 8 characters with at least one letter and one number.
     * Allows special characters: @$!%*?&
     */
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$");

    /**
     * Minimum password length requirement.
     */
    private static final int MIN_PASSWORD_LENGTH = 8;

    /**
     * Maximum password length requirement.
     */
    private static final int MAX_PASSWORD_LENGTH = 128;

    /**
     * Minimum name length requirement.
     */
    private static final int MIN_NAME_LENGTH = 2;

    /**
     * Maximum name length requirement.
     */
    private static final int MAX_NAME_LENGTH = 50;

    /**
     * Validates an email address format.
     *
     * @param email the email address to validate
     * @return true if the email format is valid, false otherwise
     */
    public boolean isValidEmail(String email) {
        return email != null && !email.isBlank() && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validates a user name.
     *
     * @param name the name to validate
     * @return true if the name is valid, false otherwise
     */
    public boolean isValidName(String name) {
        return name != null && !name.isBlank() && NAME_PATTERN.matcher(name.trim()).matches();
    }

    /**
     * Validates a password based on security requirements.
     *
     * @param password the password to validate
     * @return true if the password meets all requirements, false otherwise
     */
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < MIN_PASSWORD_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Checks if a string is null or blank.
     *
     * @param value the string to check
     * @return true if the string is null or blank, false otherwise
     */
    public boolean isNullOrBlank(String value) {
        return value == null || value.isBlank();
    }

    /**
     * Validates a registration request and throws ValidationException if invalid.
     *
     * @param request the registration request to validate
     * @throws ValidationException if validation fails
     */
    public void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new ValidationException("Registration request cannot be null");
        }

        if (isNullOrBlank(request.getName())) {
            throw new ValidationException("Name is required");
        }

        if (!isValidName(request.getName())) {
            throw new ValidationException(
                    String.format("Invalid name. Must be %d-%d characters, letters and spaces only.",
                            MIN_NAME_LENGTH, MAX_NAME_LENGTH));
        }

        if (isNullOrBlank(request.getEmail())) {
            throw new ValidationException("Email is required");
        }

        if (!isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (isNullOrBlank(request.getPassword())) {
            throw new ValidationException("Password is required");
        }

        if (!isValidPassword(request.getPassword())) {
            throw new ValidationException(
                    String.format(
                            "Invalid password. Must be %d-%d characters and include at least one letter and one number.",
                            MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH));
        }
    }

    /**
     * Validates a login request and throws ValidationException if invalid.
     *
     * @param request the login request to validate
     * @throws ValidationException if validation fails
     */
    public void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new ValidationException("Login request cannot be null");
        }

        if (isNullOrBlank(request.getEmail())) {
            throw new ValidationException("Email is required");
        }

        if (!isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (isNullOrBlank(request.getPassword())) {
            throw new ValidationException("Password is required");
        }
    }

    /**
     * Validates an authorization header for JWT token.
     *
     * @param authHeader the authorization header to validate
     * @return true if the header is valid (Bearer token format), false otherwise
     */
    public boolean isValidAuthHeader(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7;
    }

    /**
     * Extracts the JWT token from an authorization header.
     *
     * @param authHeader the authorization header containing the Bearer token
     * @return the extracted JWT token
     * @throws ValidationException if the header is invalid
     */
    public String extractToken(String authHeader) {
        if (!isValidAuthHeader(authHeader)) {
            throw new ValidationException("Invalid authorization header format. Expected: Bearer <token>");
        }
        return authHeader.substring(7);
    }

    /**
     * Validates an email domain (basic check for common patterns).
     *
     * @param email the email address to check
     * @return true if the domain appears valid, false otherwise
     */
    public boolean hasValidEmailDomain(String email) {
        if (!isValidEmail(email)) {
            return false;
        }
        String domain = email.substring(email.indexOf('@') + 1);
        return domain.contains(".") && !domain.startsWith(".") && !domain.endsWith(".");
    }

    /**
     * Checks password strength and returns a score (0-4).
     * 0 = Very Weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
     *
     * @param password the password to evaluate
     * @return strength score from 0 to 4
     */
    public int getPasswordStrength(String password) {
        if (password == null || password.isEmpty()) {
            return 0;
        }

        int score = 0;

        // Length check
        if (password.length() >= 8)
            score++;
        if (password.length() >= 12)
            score++;

        // Complexity checks
        if (password.matches(".*[a-z].*") && password.matches(".*[A-Z].*"))
            score++;
        if (password.matches(".*\\d.*"))
            score++;
        if (password.matches(".*[@$!%*?&].*"))
            score++;

        return Math.min(score, 4);
    }
}
