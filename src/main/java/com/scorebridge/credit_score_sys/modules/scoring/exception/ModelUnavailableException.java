package com.scorebridge.credit_score_sys.modules.scoring.exception;

/**
 * Exception thrown when the ML model service is unavailable.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
public class ModelUnavailableException extends RuntimeException {

    public ModelUnavailableException(String message) {
        super(message);
    }

    public ModelUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
