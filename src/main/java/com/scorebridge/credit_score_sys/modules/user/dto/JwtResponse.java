package com.scorebridge.credit_score_sys.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a JWT authentication response.
 * Contains the JWT token and basic user information returned after successful
 * authentication.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "JWT authentication response containing token and user information")
public class JwtResponse {

    /**
     * The JWT access token for authentication.
     */
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    /**
     * The type of token (always "Bearer" for JWT).
     */
    @Schema(description = "Token type", example = "Bearer", defaultValue = "Bearer")
    @Builder.Default
    private String type = "Bearer";

    /**
     * Optional refresh token for obtaining new access tokens.
     */
    @Schema(description = "JWT refresh token (optional)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;

    /**
     * Basic information about the authenticated user.
     */
    @Schema(description = "User information")
    private UserInfo user;

    /**
     * Constructs a JwtResponse with token and user info.
     *
     * @param token the JWT token
     * @param user  the user information
     */
    public JwtResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    /**
     * Constructs a JwtResponse with token, refresh token, and user info.
     *
     * @param token        the JWT token
     * @param refreshToken the refresh token
     * @param user         the user information
     */
    public JwtResponse(String token, String refreshToken, UserInfo user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    /**
     * Inner class representing basic user information.
     * Contains essential user details without sensitive information.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "User basic information")
    public static class UserInfo {

        /**
         * The user's unique identifier.
         */
        @Schema(description = "User unique identifier", example = "1")
        private Long id;

        /**
         * The user's full name.
         */
        @Schema(description = "User's full name", example = "John Doe")
        private String name;

        /**
         * The user's email address.
         */
        @Schema(description = "User's email address", example = "john.doe@example.com")
        private String email;
    }
}