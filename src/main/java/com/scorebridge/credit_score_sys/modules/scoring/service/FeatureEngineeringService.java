package com.scorebridge.credit_score_sys.modules.scoring.service;

import com.scorebridge.credit_score_sys.modules.scoring.dto.InteractiveScoreRequest;
import com.scorebridge.credit_score_sys.modules.scoring.dto.MlModelRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for transforming user input into ML-compatible features.
 * Maps InteractiveScoreRequest to MlModelRequest with proper feature
 * engineering.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Slf4j
@Service
public class FeatureEngineeringService {

    /**
     * Transform interactive score request to ML model request.
     * Performs feature engineering and normalization.
     * 
     * @param request the user input
     * @return ML model request with engineered features
     */
    public MlModelRequest transformToMlFeatures(InteractiveScoreRequest request) {
        log.debug("Transforming user input to ML features");

        return MlModelRequest.builder()
                .age(request.getAge())
                .annualIncome(request.getAnnualIncome())
                .monthlyInhandSalary(request.getMonthlySalary())
                .monthlyBalance(request.getMonthlyBalance())
                .numBankAccounts(request.getNumBankAccounts())
                .numCreditCard(request.getNumCreditCards())
                .interestRate(request.getInterestRate())
                .numOfLoan(request.getNumLoans())
                .delayFromDueDate(request.getDelayFromDueDate())
                .numOfDelayedPayment(request.getNumDelayedPayments())
                .numCreditInquiries(request.getNumCreditInquiries())
                .creditUtilizationRatio(request.getCreditUtilizationRatio())
                .creditHistoryAgeMonths(request.getCreditHistoryAgeMonths())
                .totalEmiPerMonth(request.getTotalEmiPerMonth())
                .amountInvestedMonthly(request.getAmountInvestedMonthly())
                .outstandingDebt(request.getOutstandingDebt())
                .build();
    }

    /**
     * Calculate Payment Consistency score (P component).
     * Based on payment delays and payment history.
     * 
     * @param request the user input
     * @return score between 0-100
     */
    public double calculatePaymentConsistency(InteractiveScoreRequest request) {
        // Factors: delay from due date, number of delayed payments
        double delayScore = 100.0 - Math.min(request.getDelayFromDueDate() * 2.0, 50.0);
        double delayedPaymentScore = 100.0 - Math.min(request.getNumDelayedPayments() * 3.0, 50.0);

        // Weight: 60% for delay, 40% for delayed payments
        double score = (delayScore * 0.6) + (delayedPaymentScore * 0.4);

        log.debug("Payment consistency score: {}", score);
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate Income Reliability score (I component).
     * Based on annual income, monthly salary stability.
     * 
     * @param request the user input
     * @return score between 0-100
     */
    public double calculateIncomeReliability(InteractiveScoreRequest request) {
        // Check income-to-salary ratio for consistency
        double expectedMonthlySalary = request.getAnnualIncome() / 12.0;
        double salaryRatio = request.getMonthlySalary() / expectedMonthlySalary;

        // Income level score (normalize based on typical income ranges)
        double incomeScore = Math.min((request.getAnnualIncome() / 100000.0) * 50, 50);

        // Consistency bonus
        double consistencyScore = (salaryRatio >= 0.7 && salaryRatio <= 1.3) ? 50 : 25;

        double score = incomeScore + consistencyScore;

        log.debug("Income reliability score: {}", score);
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate Transaction Patterns score (T component).
     * Based on EMI management, investment habits, credit inquiries.
     * 
     * @param request the user input
     * @return score between 0-100
     */
    public double calculateTransactionPatterns(InteractiveScoreRequest request) {
        // EMI to salary ratio (lower is better)
        double emiRatio = request.getTotalEmiPerMonth() / request.getMonthlySalary();
        double emiScore = emiRatio < 0.3 ? 40 : (emiRatio < 0.5 ? 25 : 10);

        // Investment score (higher investment is better)
        double investmentRatio = request.getAmountInvestedMonthly() / request.getMonthlySalary();
        double investmentScore = Math.min(investmentRatio * 100, 30);

        // Credit inquiries penalty (fewer is better)
        double inquiryPenalty = Math.min(request.getNumCreditInquiries() * 5, 30);

        double score = emiScore + investmentScore + 30 - inquiryPenalty;

        log.debug("Transaction patterns score: {}", score);
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate Savings Stability score (S component).
     * Based on monthly balance, credit utilization, debt levels.
     * 
     * @param request the user input
     * @return score between 0-100
     */
    public double calculateSavingsStability(InteractiveScoreRequest request) {
        // Balance to salary ratio
        double balanceRatio = request.getMonthlyBalance() / request.getMonthlySalary();
        double balanceScore = Math.min(balanceRatio * 50, 40);

        // Credit utilization (lower is better)
        double utilizationPenalty = request.getCreditUtilizationRatio() > 30
                ? (request.getCreditUtilizationRatio() - 30) * 0.5
                : 0;

        // Debt to income ratio
        double debtRatio = request.getOutstandingDebt() / request.getAnnualIncome();
        double debtScore = debtRatio < 0.3 ? 30 : (debtRatio < 0.5 ? 20 : 10);

        double score = balanceScore + debtScore + 30 - utilizationPenalty;

        log.debug("Savings stability score: {}", score);
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Validate that the request has sufficient data for scoring.
     * 
     * @param request the user input
     * @return true if data is sufficient
     */
    public boolean hasSufficientData(InteractiveScoreRequest request) {
        return request.getAge() != null &&
                request.getAnnualIncome() != null &&
                request.getMonthlySalary() != null &&
                request.getMonthlyBalance() != null &&
                request.getNumBankAccounts() != null &&
                request.getNumCreditCards() != null;
    }
}
