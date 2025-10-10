package com.scorebridge.credit_score_sys.modules.user.controller;

import com.scorebridge.credit_score_sys.modules.user.dto.*;
import com.scorebridge.credit_score_sys.modules.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication operations.
 * Handles user registration, login, token refresh, and token validation.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication and user management endpoints")
public class AuthController {

        private final AuthService authService;

        /**
         * Registers a new user in the system.
         *
         * @param request the registration request containing user details
         * @return ResponseEntity with JWT token and user information upon successful
         *         registration
         */
        @Operation(summary = "Register a new user", description = "Creates a new user account and returns a JWT token for authentication")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class), examples = @ExampleObject(value = "{\"success\":true,\"message\":\"User registered successfully\",\"data\":{\"token\":\"jwt_token_here\",\"type\":\"Bearer\",\"user\":{\"id\":1,\"name\":\"John Doe\",\"email\":\"john@example.com\"}}}"))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or email already exists", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class), examples = @ExampleObject(value = "{\"success\":false,\"message\":\"Email is already registered\",\"data\":null}"))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class)))
        })
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<JwtResponse>> register(@Valid @RequestBody RegisterRequest request) {
                JwtResponse jwtResponse = authService.registerUser(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.success("User registered successfully", jwtResponse));
        }

        /**
         * Authenticates a user with provided credentials.
         *
         * @param request the login request containing email and password
         * @return ResponseEntity with JWT token and user information upon successful
         *         authentication
         */
        @Operation(summary = "Authenticate user", description = "Authenticates user credentials and returns a JWT token")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class)))
        })
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
                JwtResponse jwtResponse = authService.loginUser(request);
                return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
        }

        /**
         * Refreshes an existing JWT token.
         *
         * @param authHeader the authorization header containing the Bearer token
         * @return ResponseEntity with new JWT token and user information
         */
        @Operation(summary = "Refresh JWT token", description = "Refreshes an existing JWT token with a new expiration time")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token refreshed successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid or expired token", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class)))
        })
        @SecurityRequirement(name = "bearerAuth")
        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(
                        @Parameter(description = "JWT token in Bearer format", required = true, example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") @RequestHeader("Authorization") String authHeader) {
                JwtResponse jwtResponse = authService.refreshToken(authHeader);
                return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", jwtResponse));
        }

        /**
         * Validates a JWT token.
         *
         * @param authHeader the authorization header containing the Bearer token
         * @return ResponseEntity with token validation result
         */
        @Operation(summary = "Validate JWT token", description = "Validates the provided JWT token and returns validation status")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token validation completed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class)))
        })
        @GetMapping("/validate")
        public ResponseEntity<ApiResponse<Boolean>> validateToken(
                        @Parameter(description = "JWT token in Bearer format", required = true, example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") @RequestHeader("Authorization") String authHeader) {
                boolean isValid = authService.validateToken(authHeader);
                return ResponseEntity.ok(ApiResponse.success("Token validation result", isValid));
        }

        /**
         * Logs out a user by invalidating their JWT token.
         *
         * @param authHeader the authorization header containing the Bearer token
         * @return ResponseEntity indicating successful logout
         */
        @Operation(summary = "Logout user", description = "Logs out the user by blacklisting their JWT token, making it invalid for future requests")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logout successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class), examples = @ExampleObject(value = "{\"success\":true,\"message\":\"Logout successful\",\"data\":null}"))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid or expired token", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class)))
        })
        @SecurityRequirement(name = "bearerAuth")
        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout(
                        @Parameter(description = "JWT token in Bearer format", required = true, example = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") @RequestHeader("Authorization") String authHeader) {
                authService.logoutUser(authHeader);
                return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
        }
}