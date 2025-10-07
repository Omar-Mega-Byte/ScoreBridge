package com.scorebridge.credit_score_sys.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic wrapper for API responses.
 * Provides a consistent structure for all API responses with success status,
 * message, and data.
 *
 * @param <T> the type of data contained in the response
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Generic API response wrapper")
public class ApiResponse<T> {

    /**
     * Indicates whether the operation was successful.
     */
    @Schema(description = "Indicates if the operation was successful", example = "true")
    private boolean success;

    /**
     * A human-readable message describing the result of the operation.
     */
    @Schema(description = "Response message", example = "Operation completed successfully")
    private String message;

    /**
     * The data payload of the response.
     */
    @Schema(description = "Response data payload")
    private T data;

    /**
     * Creates a successful response with data.
     *
     * @param <T>  the type of data
     * @param data the response data
     * @return a successful ApiResponse
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }

    /**
     * Creates a successful response with a custom message and data.
     *
     * @param <T>     the type of data
     * @param message the success message
     * @param data    the response data
     * @return a successful ApiResponse
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Creates an error response with a message.
     *
     * @param <T>     the type of data
     * @param message the error message
     * @return an error ApiResponse
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    /**
     * Creates an error response with a message and data.
     *
     * @param <T>     the type of data
     * @param message the error message
     * @param data    the response data
     * @return an error ApiResponse
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data);
    }
}