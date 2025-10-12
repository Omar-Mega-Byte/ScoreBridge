package com.scorebridge.credit_score_sys.modules.scoring.service;

import com.scorebridge.credit_score_sys.modules.scoring.dto.*;
import com.scorebridge.credit_score_sys.modules.scoring.exception.InsufficientDataException;
import com.scorebridge.credit_score_sys.modules.scoring.exception.ScoreNotFoundException;
import com.scorebridge.credit_score_sys.modules.scoring.model.CreditScore;
import com.scorebridge.credit_score_sys.modules.scoring.repository.CreditScoreRepository;
import com.scorebridge.credit_score_sys.modules.user.exception.UserNotFoundException;
import com.scorebridge.credit_score_sys.modules.user.model.User;
import com.scorebridge.credit_score_sys.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Main service for credit score calculation and management.
 * Orchestrates feature engineering, ML model calls, and score persistence.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScoringService {

    private final FeatureEngineeringService featureEngineeringService;
    private final MlModelClient mlModelClient;
    private final CreditScoreRepository creditScoreRepository;
    private final UserRepository userRepository;

    /**
     * Calculate credit score for interactive (anonymous or registered) user.
     * 
     * @param request the user's financial data
     * @return complete score calculation response
     */
    @Transactional
    public ScoreCalculationResponse calculateInteractiveScore(InteractiveScoreRequest request) {
        log.info("Starting interactive score calculation");

        // Validate sufficient data
        if (!featureEngineeringService.hasSufficientData(request)) {
            throw new InsufficientDataException("Insufficient data provided for scoring");
        }

        // Transform to ML features
        MlModelRequest mlRequest = featureEngineeringService.transformToMlFeatures(request);

        // Call ML model for prediction
        MlModelResponse mlResponse = mlModelClient.predict(mlRequest);

        // Build component scores
        ComponentScores components = ComponentScores.builder()
                .paymentConsistency(mlResponse.getPaymentConsistency())
                .incomeReliability(mlResponse.getIncomeReliability())
                .transactionPatterns(mlResponse.getTransactionPatterns())
                .savingsStability(mlResponse.getSavingsStability())
                .alphaWeight(mlResponse.getAlphaWeight())
                .betaWeight(mlResponse.getBetaWeight())
                .gammaWeight(mlResponse.getGammaWeight())
                .deltaWeight(mlResponse.getDeltaWeight())
                .build();

        // Determine risk level
        String riskLevel = determineRiskLevel(mlResponse.getPredictedScore());

        // Generate explanation and recommendations
        String explanation = generateExplanation(mlResponse);
        String recommendations = generateRecommendations(mlResponse, request);

        // Save score if user is registered
        boolean saved = false;
        if (request.getUserId() != null) {
            saved = saveScore(request.getUserId(), mlResponse, request);
        }

        // Build response
        ScoreCalculationResponse response = ScoreCalculationResponse.builder()
                .sbiScore(mlResponse.getPredictedScore())
                .scoreCategory(mlResponse.getScoreCategory())
                .components(components)
                .riskLevel(riskLevel)
                .explanation(explanation)
                .recommendations(recommendations)
                .calculatedAt(LocalDateTime.now())
                .modelVersion(mlResponse.getModelVersion())
                .saved(saved)
                .confidenceLevel(mlResponse.getConfidenceLevel())
                .build();

        log.info("Score calculation completed. SBI Score: {}", response.getSbiScore());
        return response;
    }

    /**
     * Get score history for a registered user.
     * 
     * @param userId the user ID
     * @return list of past score calculations
     */
    public List<ScoreCalculationResponse> getScoreHistory(Long userId) {
        log.info("Retrieving score history for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        List<CreditScore> scores = creditScoreRepository.findByUserOrderByCalculatedAtDesc(user);

        return scores.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get latest score for a user.
     * 
     * @param userId the user ID
     * @return the most recent score calculation
     */
    public ScoreCalculationResponse getLatestScore(Long userId) {
        log.info("Retrieving latest score for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        CreditScore score = creditScoreRepository.findFirstByUserOrderByCalculatedAtDesc(user)
                .orElseThrow(() -> new ScoreNotFoundException("No scores found for user"));

        return convertToResponse(score);
    }

    /**
     * Save calculated score to database for registered user.
     * 
     * @param userId     the user ID
     * @param mlResponse the ML model response
     * @param request    the original request
     * @return true if saved successfully
     */
    private boolean saveScore(Long userId, MlModelResponse mlResponse, InteractiveScoreRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

            CreditScore creditScore = CreditScore.builder()
                    .user(user)
                    .sbiScore(mlResponse.getPredictedScore())
                    .scoreCategory(mlResponse.getScoreCategory())
                    .componentP(mlResponse.getPaymentConsistency())
                    .componentI(mlResponse.getIncomeReliability())
                    .componentT(mlResponse.getTransactionPatterns())
                    .componentS(mlResponse.getSavingsStability())
                    .alphaWeight(mlResponse.getAlphaWeight())
                    .betaWeight(mlResponse.getBetaWeight())
                    .gammaWeight(mlResponse.getGammaWeight())
                    .deltaWeight(mlResponse.getDeltaWeight())
                    .modelVersion(mlResponse.getModelVersion())
                    .confidenceLevel(mlResponse.getConfidenceLevel())
                    .riskLevel(determineRiskLevel(mlResponse.getPredictedScore()))
                    .annualIncome(request.getAnnualIncome())
                    .monthlyBalance(request.getMonthlyBalance())
                    .outstandingDebt(request.getOutstandingDebt())
                    .creditUtilizationRatio(request.getCreditUtilizationRatio())
                    .calculatedAt(LocalDateTime.now())
                    .build();

            creditScoreRepository.save(creditScore);
            log.info("Score saved successfully for user: {}", userId);
            return true;
        } catch (Exception e) {
            log.error("Error saving score for user: {}", userId, e);
            return false;
        }
    }

    /**
     * Convert CreditScore entity to response DTO.
     */
    private ScoreCalculationResponse convertToResponse(CreditScore score) {
        ComponentScores components = ComponentScores.builder()
                .paymentConsistency(score.getComponentP())
                .incomeReliability(score.getComponentI())
                .transactionPatterns(score.getComponentT())
                .savingsStability(score.getComponentS())
                .alphaWeight(score.getAlphaWeight())
                .betaWeight(score.getBetaWeight())
                .gammaWeight(score.getGammaWeight())
                .deltaWeight(score.getDeltaWeight())
                .build();

        return ScoreCalculationResponse.builder()
                .sbiScore(score.getSbiScore())
                .scoreCategory(score.getScoreCategory())
                .components(components)
                .riskLevel(score.getRiskLevel())
                .calculatedAt(score.getCalculatedAt())
                .modelVersion(score.getModelVersion())
                .saved(true)
                .confidenceLevel(score.getConfidenceLevel())
                .build();
    }

    /**
     * Determine risk level based on SBI score.
     */
    private String determineRiskLevel(int sbiScore) {
        if (sbiScore >= 700)
            return "Low Risk";
        if (sbiScore >= 600)
            return "Moderate Risk";
        return "High Risk";
    }

    /**
     * Generate human-readable explanation of the score.
     */
    private String generateExplanation(MlModelResponse response) {
        int score = response.getPredictedScore();
        String category = response.getScoreCategory();

        if (score >= 750) {
            return String.format("Excellent! Your ScoreBridge Index of %d puts you in the '%s' category. " +
                    "You demonstrate outstanding financial responsibility and have access to the best credit options.",
                    score, category);
        } else if (score >= 700) {
            return String.format("Great! Your ScoreBridge Index of %d is in the '%s' range. " +
                    "You show strong financial habits and qualify for favorable credit terms.",
                    score, category);
        } else if (score >= 650) {
            return String.format("Good! Your ScoreBridge Index of %d is '%s'. " +
                    "You demonstrate reliable financial behavior with room for improvement.",
                    score, category);
        } else if (score >= 600) {
            return String.format("Fair. Your ScoreBridge Index of %d is in the '%s' category. " +
                    "There are opportunities to improve your financial standing.",
                    score, category);
        } else {
            return String.format("Your ScoreBridge Index of %d is in the '%s' range. " +
                    "We recommend focusing on improving your financial habits for better credit access.",
                    score, category);
        }
    }

    /**
     * Generate personalized recommendations based on scores.
     */
    private String generateRecommendations(MlModelResponse response, InteractiveScoreRequest request) {
        StringBuilder recommendations = new StringBuilder();

        // Payment consistency recommendations
        if (response.getPaymentConsistency() < 70) {
            recommendations.append("• Improve payment consistency: Set up automatic payments to avoid delays. ");
        }

        // Income recommendations
        if (response.getIncomeReliability() < 70) {
            recommendations.append(
                    "• Consider building more stable income sources or maintaining consistent salary deposits. ");
        }

        // Transaction pattern recommendations
        if (response.getTransactionPatterns() < 70) {
            if (request.getTotalEmiPerMonth() / request.getMonthlySalary() > 0.4) {
                recommendations
                        .append("• Reduce EMI burden: Your EMI to salary ratio is high. Consider debt consolidation. ");
            }
            if (request.getAmountInvestedMonthly() / request.getMonthlySalary() < 0.1) {
                recommendations.append("• Increase monthly investments to demonstrate financial planning. ");
            }
        }

        // Savings recommendations
        if (response.getSavingsStability() < 70) {
            if (request.getCreditUtilizationRatio() > 30) {
                recommendations.append("• Lower credit utilization: Keep it below 30% for better scores. ");
            }
            if (request.getMonthlyBalance() / request.getMonthlySalary() < 0.5) {
                recommendations.append("• Build emergency savings: Aim for at least 50% of monthly salary as buffer. ");
            }
        }

        if (recommendations.length() == 0) {
            recommendations.append(
                    "• Excellent! Maintain your current financial habits and continue monitoring your score regularly.");
        }

        return recommendations.toString();
    }
}
