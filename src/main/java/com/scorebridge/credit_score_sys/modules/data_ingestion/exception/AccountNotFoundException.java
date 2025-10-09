package com.scorebridge.credit_score_sys.modules.data_ingestion.exception;

/**
 * Exception thrown when a financial account is not found.
 * This can occur when trying to retrieve or update an account that doesn't
 * exist.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
public class AccountNotFoundException extends RuntimeException {

    /**
     * Constructs a new AccountNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public AccountNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new AccountNotFoundException with the specified detail message
     * and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public AccountNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
