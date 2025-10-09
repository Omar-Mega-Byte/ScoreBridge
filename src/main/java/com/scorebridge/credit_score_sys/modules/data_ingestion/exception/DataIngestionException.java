package com.scorebridge.credit_score_sys.modules.data_ingestion.exception;

/**
 * Exception thrown when data ingestion fails due to processing errors.
 * This can occur during CSV parsing, data transformation, or database
 * persistence.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
public class DataIngestionException extends RuntimeException {

    /**
     * Constructs a new DataIngestionException with the specified detail message.
     *
     * @param message the detail message
     */
    public DataIngestionException(String message) {
        super(message);
    }

    /**
     * Constructs a new DataIngestionException with the specified detail message and
     * cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public DataIngestionException(String message, Throwable cause) {
        super(message, cause);
    }
}
