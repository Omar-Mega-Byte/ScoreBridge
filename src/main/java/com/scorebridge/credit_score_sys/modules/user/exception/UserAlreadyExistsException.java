package com.scorebridge.credit_score_sys.modules.user.exception;

/**
 * Exception thrown when attempting to register a user with an email that
 * already exists in the system.
 * This is a runtime exception that indicates a conflict in user registration.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
public class UserAlreadyExistsException extends RuntimeException {

    /**
     * Constructs a new UserAlreadyExistsException with the specified detail
     * message.
     *
     * @param message the detail message explaining the reason for the exception
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }

    /**
     * Constructs a new UserAlreadyExistsException with the specified detail message
     * and cause.
     *
     * @param message the detail message explaining the reason for the exception
     * @param cause   the cause of the exception
     */
    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
