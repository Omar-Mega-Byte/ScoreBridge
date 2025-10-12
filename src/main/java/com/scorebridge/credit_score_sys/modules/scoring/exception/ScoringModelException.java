package com.scorebridge.credit_score_sys.modules.scoring.exception;

/**
 * Exception thrown when the ML model service encounters an error.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
public class ScoringModelException extends RuntimeException {

    public ScoringModelException(String message) {
        super(message);
    }

    public ScoringModelException(String message, Throwable cause) {
        super(message, cause);
    }
}
