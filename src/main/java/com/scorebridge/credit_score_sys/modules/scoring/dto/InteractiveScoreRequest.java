package com.scorebridge.credit_score_sys.modules.scoring.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Simplified DTO for interactive credit score calculation.
 * Designed for hackathon demo - users fill out a simple form.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to calculate credit score based on user's financial data")
public class InteractiveScoreRequest {

    @Schema(description = "User's age", example = "28", required = true)
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be less than 100")
    private Integer age;

    @Schema(description = "Annual income in USD", example = "50000.00", required = true)
    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.0", message = "Annual income must be positive")
    private Double annualIncome;

    @Schema(description = "Monthly in-hand salary in USD", example = "3500.00", required = true)
    @NotNull(message = "Monthly salary is required")
    @DecimalMin(value = "0.0", message = "Monthly salary must be positive")
    private Double monthlySalary;

    @Schema(description = "Current monthly balance in USD", example = "2500.00", required = true)
    @NotNull(message = "Monthly balance is required")
    private Double monthlyBalance;

    @Schema(description = "Number of bank accounts", example = "3", required = true)
    @NotNull(message = "Number of bank accounts is required")
    @Min(value = 0, message = "Number of bank accounts cannot be negative")
    @Max(value = 20, message = "Number of bank accounts seems too high")
    private Integer numBankAccounts;

    @Schema(description = "Number of credit cards", example = "2", required = true)
    @NotNull(message = "Number of credit cards is required")
    @Min(value = 0, message = "Number of credit cards cannot be negative")
    @Max(value = 20, message = "Number of credit cards seems too high")
    private Integer numCreditCards;

    @Schema(description = "Interest rate on loans (%)", example = "5.5", required = true)
    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0", message = "Interest rate must be positive")
    @DecimalMax(value = "100.0", message = "Interest rate must be less than 100%")
    private Double interestRate;

    @Schema(description = "Number of active loans", example = "2", required = true)
    @NotNull(message = "Number of loans is required")
    @Min(value = 0, message = "Number of loans cannot be negative")
    @Max(value = 10, message = "Number of loans seems too high")
    private Integer numLoans;

    @Schema(description = "Average days of delay from due date", example = "3", required = true)
    @NotNull(message = "Delay from due date is required")
    @Min(value = 0, message = "Delay cannot be negative")
    @Max(value = 90, message = "Delay seems unrealistic")
    private Integer delayFromDueDate;

    @Schema(description = "Number of delayed payments in last 12 months", example = "2", required = true)
    @NotNull(message = "Number of delayed payments is required")
    @Min(value = 0, message = "Number of delayed payments cannot be negative")
    @Max(value = 50, message = "Number of delayed payments seems too high")
    private Integer numDelayedPayments;

    @Schema(description = "Number of credit inquiries in last 6 months", example = "4", required = true)
    @NotNull(message = "Number of credit inquiries is required")
    @Min(value = 0, message = "Number of credit inquiries cannot be negative")
    @Max(value = 50, message = "Number of credit inquiries seems too high")
    private Integer numCreditInquiries;

    @Schema(description = "Credit utilization ratio (%)", example = "30.5", required = true)
    @NotNull(message = "Credit utilization ratio is required")
    @DecimalMin(value = "0.0", message = "Credit utilization ratio must be positive")
    @DecimalMax(value = "100.0", message = "Credit utilization ratio cannot exceed 100%")
    private Double creditUtilizationRatio;

    @Schema(description = "Credit history age in months", example = "60", required = true)
    @NotNull(message = "Credit history age is required")
    @Min(value = 0, message = "Credit history age cannot be negative")
    @Max(value = 1200, message = "Credit history age seems unrealistic")
    private Integer creditHistoryAgeMonths;

    @Schema(description = "Total EMI per month in USD", example = "500.00", required = true)
    @NotNull(message = "Total EMI is required")
    @DecimalMin(value = "0.0", message = "Total EMI must be positive or zero")
    private Double totalEmiPerMonth;

    @Schema(description = "Amount invested monthly in USD", example = "200.00", required = true)
    @NotNull(message = "Amount invested is required")
    @DecimalMin(value = "0.0", message = "Amount invested must be positive or zero")
    private Double amountInvestedMonthly;

    @Schema(description = "Outstanding debt in USD", example = "5000.00", required = true)
    @NotNull(message = "Outstanding debt is required")
    @DecimalMin(value = "0.0", message = "Outstanding debt must be positive or zero")
    private Double outstandingDebt;

    @Schema(description = "Optional: User ID if registered user wants to save the score", example = "1")
    private Long userId;
}
