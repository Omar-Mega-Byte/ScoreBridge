package com.scorebridge.credit_score_sys.modules.data_ingestion.exception;

/**
 * Exception thrown when financial data validation fails.
 * This can occur when user-submitted data doesn't meet the required format or
 * business rules.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
public class DataValidationException extends RuntimeException {

    /**
     * Constructs a new DataValidationException with the specified detail message.
     *
     * @param message the detail message
     */
    public DataValidationException(String message) {
        super(message);
    }

    /**
     * Constructs a new DataValidationException with the specified detail message
     * and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public DataValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
