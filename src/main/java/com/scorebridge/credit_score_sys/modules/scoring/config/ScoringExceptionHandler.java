package com.scorebridge.credit_score_sys.modules.scoring.config;

import com.scorebridge.credit_score_sys.modules.scoring.exception.*;
import com.scorebridge.credit_score_sys.modules.user.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for scoring module.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@RestControllerAdvice
public class ScoringExceptionHandler {

    @ExceptionHandler(ScoringModelException.class)
    public ResponseEntity<ApiResponse<Object>> handleScoringModelException(ScoringModelException ex) {
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InsufficientDataException.class)
    public ResponseEntity<ApiResponse<Object>> handleInsufficientDataException(InsufficientDataException ex) {
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage()),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ModelUnavailableException.class)
    public ResponseEntity<ApiResponse<Object>> handleModelUnavailableException(ModelUnavailableException ex) {
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage()),
                HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(ScoreNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleScoreNotFoundException(ScoreNotFoundException ex) {
        return new ResponseEntity<>(
                ApiResponse.error(ex.getMessage()),
                HttpStatus.NOT_FOUND);
    }
}
