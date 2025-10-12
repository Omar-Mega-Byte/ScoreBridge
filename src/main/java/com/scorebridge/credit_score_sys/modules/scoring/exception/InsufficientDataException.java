package com.scorebridge.credit_score_sys.modules.scoring.exception;

/**
 * Exception thrown when insufficient data is provided for scoring.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
public class InsufficientDataException extends RuntimeException {

    public InsufficientDataException(String message) {
        super(message);
    }

    public InsufficientDataException(String message, Throwable cause) {
        super(message, cause);
    }
}
