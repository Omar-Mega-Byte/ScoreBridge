package com.scorebridge.credit_score_sys.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a user registration request.
 * Contains all information required to create a new user account.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Registration request for creating a new user account")
public class RegisterRequest {

    /**
     * The user's first name.
     */
    @Schema(description = "User's first name", example = "John", required = true)
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name should be between 2 and 50 characters")
    private String firstName;

    /**
     * The user's last name.
     */
    @Schema(description = "User's last name", example = "Doe", required = true)
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name should be between 2 and 50 characters")
    private String lastName;

    /**
     * The user's email address. Must be unique in the system.
     */
    @Schema(description = "User's email address", example = "john.doe@example.com", required = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * The user's phone number (optional).
     */
    @Schema(description = "User's phone number", example = "+1234567890", required = false)
    @Size(max = 20, message = "Phone number should not exceed 20 characters")
    private String phoneNumber;

    /**
     * The user's password. Should be strong and secure.
     */
    @Schema(description = "User's password (minimum 6 characters)", example = "securePassword123", required = true)
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 128, message = "Password should be between 6 and 128 characters")
    private String password;
}