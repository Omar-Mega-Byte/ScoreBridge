package com.scorebridge.credit_score_sys.modules.user.exception;

/**
 * Exception thrown when a requested user cannot be found in the system.
 * This typically occurs during authentication or user lookup operations.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * Constructs a new UserNotFoundException with the specified detail message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public UserNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new UserNotFoundException with the specified detail message and
     * cause.
     *
     * @param message the detail message explaining the reason for the exception
     * @param cause   the cause of the exception
     */
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
