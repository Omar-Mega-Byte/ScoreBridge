package com.scorebridge.credit_score_sys.modules.data_ingestion.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for a financial account with its transactions.
 * Used when users manually enter their account information and transactions.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAccountDto {

    /**
     * Name of the financial institution (e.g., Chase, Bank of America).
     */
    @NotBlank(message = "Institution name is required")
    @Size(max = 255, message = "Institution name must not exceed 255 characters")
    private String institutionName;

    /**
     * Type of account (e.g., checking, savings, credit card).
     */
    @NotBlank(message = "Account type is required")
    @Size(max = 50, message = "Account type must not exceed 50 characters")
    private String accountType;

    /**
     * Last 4 digits of the account number (optional).
     */
    @Size(max = 4, message = "Account number last 4 must not exceed 4 characters")
    private String accountNumberLast4;

    /**
     * Current balance in the account.
     */
    @NotNull(message = "Current balance is required")
    @DecimalMin(value = "0.0", message = "Balance cannot be negative")
    private Double currentBalance;

    /**
     * List of transactions associated with this account.
     */
    @Valid
    private List<TransactionDto> transactions;
}
