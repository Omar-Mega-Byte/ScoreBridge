package com.scorebridge.credit_score_sys.modules.data_ingestion.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for submitting a complete financial profile.
 * This represents all the financial data a user provides through forms.
 * Can be used for both saving profiles (registered users) and instant scoring
 * (anonymous users).
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialProfileRequest {

    /**
     * User ID (optional - null for anonymous instant scoring).
     */
    private Long userId;

    /**
     * List of financial accounts with their transactions.
     * Must contain at least one account.
     */
    @NotEmpty(message = "At least one financial account is required")
    @Valid
    private List<FinancialAccountDto> accounts;

    /**
     * Optional notes or additional context from the user.
     */
    private String notes;
}
