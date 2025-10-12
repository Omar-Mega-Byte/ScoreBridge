package com.scorebridge.credit_score_sys.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for ML model prediction.
 * Contains all features needed by the ML model.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlModelRequest {

    // Demographics
    private Integer age;

    // Income features
    private Double annualIncome;
    private Double monthlyInhandSalary;
    private Double monthlyBalance;

    // Account information
    private Integer numBankAccounts;
    private Integer numCreditCard;
    private Double interestRate;

    // Loan information
    private Integer numOfLoan;

    // Payment behavior
    private Integer delayFromDueDate;
    private Integer numOfDelayedPayment;
    private Integer numCreditInquiries;

    // Credit utilization
    private Double creditUtilizationRatio;
    private Integer creditHistoryAgeMonths;

    // EMI and investments
    private Double totalEmiPerMonth;
    private Double amountInvestedMonthly;

    // Debt
    private Double outstandingDebt;
}
