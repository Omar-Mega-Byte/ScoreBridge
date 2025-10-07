package com.scorebridge.credit_score_sys.modules.user.exception;

/**
 * Exception thrown when authentication fails due to invalid credentials.
 * This occurs when the provided email or password is incorrect.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
public class InvalidCredentialsException extends RuntimeException {

    /**
     * Constructs a new InvalidCredentialsException with the specified detail
     * message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }

    /**
     * Constructs a new InvalidCredentialsException with the specified detail
     * message and cause.
     *
     * @param message the detail message explaining the reason for the exception
     * @param cause   the cause of the exception
     */
    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}
