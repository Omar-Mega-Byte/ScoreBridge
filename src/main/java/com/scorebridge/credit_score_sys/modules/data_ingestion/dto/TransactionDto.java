package com.scorebridge.credit_score_sys.modules.data_ingestion.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for a single transaction entry.
 * Used when users manually enter or upload transaction data.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    /**
     * Transaction amount (positive for income, negative for expenses).
     */
    @NotNull(message = "Transaction amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;

    /**
     * Transaction type: INCOME or EXPENSE.
     */
    @NotBlank(message = "Transaction type is required")
    @Pattern(regexp = "^(INCOME|EXPENSE)$", message = "Transaction type must be INCOME or EXPENSE")
    private String transactionType;

    /**
     * Transaction category (e.g., Rent, Salary, Utilities, Groceries).
     */
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    /**
     * Optional description of the transaction.
     */
    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    /**
     * Date when the transaction occurred.
     */
    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;
}
