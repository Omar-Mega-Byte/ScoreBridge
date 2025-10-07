package com.scorebridge.credit_score_sys.modules.user.exception;

/**
 * Exception thrown when user input validation fails.
 * This occurs when provided data does not meet the required format or
 * constraints.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
public class ValidationException extends RuntimeException {

    /**
     * Constructs a new ValidationException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public ValidationException(String message) {
        super(message);
    }

    /**
     * Constructs a new ValidationException with the specified detail message and
     * cause.
     *
     * @param message the detail message explaining the reason for the exception
     * @param cause   the cause of the exception
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
