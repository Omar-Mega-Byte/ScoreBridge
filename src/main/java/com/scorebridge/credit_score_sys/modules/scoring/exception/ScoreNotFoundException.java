package com.scorebridge.credit_score_sys.modules.scoring.exception;

/**
 * Exception thrown when a score is not found.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
public class ScoreNotFoundException extends RuntimeException {

    public ScoreNotFoundException(String message) {
        super(message);
    }

    public ScoreNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
