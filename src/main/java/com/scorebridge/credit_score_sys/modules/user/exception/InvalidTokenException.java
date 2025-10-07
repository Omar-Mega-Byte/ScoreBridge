package com.scorebridge.credit_score_sys.modules.user.exception;

/**
 * Exception thrown when a JWT token is invalid, expired, or malformed.
 * This occurs during token validation or refresh operations.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
public class InvalidTokenException extends RuntimeException {

    /**
     * Constructs a new InvalidTokenException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public InvalidTokenException(String message) {
        super(message);
    }

    /**
     * Constructs a new InvalidTokenException with the specified detail message and
     * cause.
     *
     * @param message the detail message explaining the reason for the exception
     * @param cause   the cause of the exception
     */
    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
