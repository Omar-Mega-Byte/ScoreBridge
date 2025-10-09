package com.scorebridge.credit_score_sys.modules.data_ingestion.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.AccountNotFoundException;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.DataIngestionException;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.DataValidationException;
import com.scorebridge.credit_score_sys.modules.user.dto.ApiResponse;

/**
 * Global exception handler for the data ingestion module.
 * Handles all exceptions thrown by data ingestion controllers and services.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@RestControllerAdvice(basePackages = "com.scorebridge.credit_score_sys.modules.data_ingestion")
public class DataIngestionExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(DataIngestionExceptionHandler.class);

    /**
     * Handles DataValidationException.
     *
     * @param ex the exception
     * @return error response with validation message
     */
    @ExceptionHandler(DataValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataValidationException(DataValidationException ex) {
        logger.error("Data validation error: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles AccountNotFoundException.
     *
     * @param ex the exception
     * @return error response with not found message
     */
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccountNotFoundException(AccountNotFoundException ex) {
        logger.error("Account not found: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handles DataIngestionException.
     *
     * @param ex the exception
     * @return error response with ingestion error message
     */
    @ExceptionHandler(DataIngestionException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIngestionException(DataIngestionException ex) {
        logger.error("Data ingestion error: {}", ex.getMessage(), ex);
        ApiResponse<Void> response = ApiResponse.error("Failed to process financial data: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handles validation errors from @Valid annotations.
     *
     * @param ex the exception
     * @return error response with validation details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder errorMessage = new StringBuilder("Validation failed: ");
        ex.getBindingResult().getFieldErrors().forEach(error -> errorMessage.append(error.getField())
                .append(" - ")
                .append(error.getDefaultMessage())
                .append("; "));

        logger.error("Request validation failed: {}", errorMessage);
        ApiResponse<Void> response = ApiResponse.error(errorMessage.toString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles all other unexpected exceptions.
     *
     * @param ex the exception
     * @return generic error response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        logger.error("Unexpected error in data ingestion module", ex);
        ApiResponse<Void> response = ApiResponse.error("An unexpected error occurred: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
