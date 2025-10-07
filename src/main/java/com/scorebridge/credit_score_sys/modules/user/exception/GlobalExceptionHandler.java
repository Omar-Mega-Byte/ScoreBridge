package com.scorebridge.credit_score_sys.modules.user.exception;

import com.scorebridge.credit_score_sys.modules.user.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * Catches and handles exceptions across all controllers, providing consistent
 * error responses.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles UserAlreadyExistsException when attempting to register a duplicate
     * user.
     *
     * @param ex      the UserAlreadyExistsException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 409 CONFLICT status
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserAlreadyExists(
            UserAlreadyExistsException ex, WebRequest request) {
        log.error("User already exists: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handles UserNotFoundException when a requested user cannot be found.
     *
     * @param ex      the UserNotFoundException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 404 NOT_FOUND status
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFound(
            UserNotFoundException ex, WebRequest request) {
        log.error("User not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handles InvalidCredentialsException and BadCredentialsException for
     * authentication failures.
     *
     * @param ex      the InvalidCredentialsException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 401 UNAUTHORIZED status
     */
    @ExceptionHandler({ InvalidCredentialsException.class, BadCredentialsException.class })
    public ResponseEntity<ApiResponse<Object>> handleInvalidCredentials(
            Exception ex, WebRequest request) {
        log.error("Invalid credentials: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid email or password"));
    }

    /**
     * Handles InvalidTokenException when JWT token validation fails.
     *
     * @param ex      the InvalidTokenException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 401 UNAUTHORIZED status
     */
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidToken(
            InvalidTokenException ex, WebRequest request) {
        log.error("Invalid token: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handles ValidationException for custom validation failures.
     *
     * @param ex      the ValidationException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 400 BAD_REQUEST status
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(
            ValidationException ex, WebRequest request) {
        log.error("Validation error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handles Spring's MethodArgumentNotValidException for bean validation
     * failures.
     * Extracts field-level validation errors and returns them in a structured
     * format.
     *
     * @param ex the MethodArgumentNotValidException thrown
     * @return ResponseEntity with field errors and HTTP 400 BAD_REQUEST status
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Validation failed", errors));
    }

    /**
     * Handles UsernameNotFoundException thrown by Spring Security.
     *
     * @param ex      the UsernameNotFoundException thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 404 NOT_FOUND status
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameNotFound(
            UsernameNotFoundException ex, WebRequest request) {
        log.error("Username not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("User not found"));
    }

    /**
     * Handles all other unexpected exceptions.
     * Logs the full stack trace and returns a generic error message to the client.
     *
     * @param ex      the Exception thrown
     * @param request the web request where the exception occurred
     * @return ResponseEntity with error details and HTTP 500 INTERNAL_SERVER_ERROR
     *         status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(
            Exception ex, WebRequest request) {
        log.error("Unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred. Please try again later."));
    }
}
