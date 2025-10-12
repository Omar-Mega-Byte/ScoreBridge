package com.scorebridge.credit_score_sys.modules.scoring.service;

import com.scorebridge.credit_score_sys.modules.scoring.config.MlModelConfig;
import com.scorebridge.credit_score_sys.modules.scoring.dto.MlModelRequest;
import com.scorebridge.credit_score_sys.modules.scoring.dto.MlModelResponse;
import com.scorebridge.credit_score_sys.modules.scoring.exception.ModelUnavailableException;
import com.scorebridge.credit_score_sys.modules.scoring.exception.ScoringModelException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;

/**
 * Client service for communicating with the Python ML model service.
 * Handles HTTP requests and responses with proper error handling and retries.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MlModelClient {

    private final MlModelConfig config;
    private final WebClient.Builder webClientBuilder;

    /**
     * Predict credit score using the ML model service.
     * 
     * @param request the ML model request with financial features
     * @return the ML model response with predicted score
     * @throws ModelUnavailableException if the service is unavailable
     * @throws ScoringModelException     if there's an error during prediction
     */
    public MlModelResponse predict(MlModelRequest request) {
        log.info("Calling ML model service for prediction");

        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(config.getUrl())
                    .build();

            MlModelResponse response = webClient.post()
                    .uri(config.getPredictEndpoint())
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlModelResponse.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .retryWhen(Retry.fixedDelay(config.getMaxRetries(), Duration.ofSeconds(1))
                            .filter(throwable -> !(throwable instanceof WebClientResponseException.BadRequest))
                            .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> {
                                throw new ModelUnavailableException(
                                        "ML service unavailable after " + config.getMaxRetries() + " retries");
                            }))
                    .block();

            if (response == null) {
                throw new ScoringModelException("ML service returned null response");
            }

            log.info("ML model prediction successful. Score: {}", response.getPredictedScore());
            return response;

        } catch (WebClientResponseException.BadRequest e) {
            log.error("Bad request to ML service: {}", e.getMessage());
            throw new ScoringModelException("Invalid data sent to ML service: " + e.getMessage(), e);
        } catch (WebClientResponseException e) {
            log.error("ML service error: {} - {}", e.getStatusCode(), e.getMessage());
            throw new ScoringModelException("ML service error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error calling ML service", e);
            if (config.isFallbackEnabled()) {
                log.warn("Using fallback scoring mechanism");
                return createFallbackResponse(request);
            }
            throw new ModelUnavailableException("ML service is unavailable: " + e.getMessage(), e);
        }
    }

    /**
     * Creates a fallback response when ML service is unavailable.
     * Uses simple heuristics for demo purposes.
     * 
     * @param request the original request
     * @return a fallback ML model response
     */
    private MlModelResponse createFallbackResponse(MlModelRequest request) {
        log.info("Creating fallback response");

        // Simple heuristic scoring for demo
        double paymentScore = calculatePaymentScore(request);
        double incomeScore = calculateIncomeScore(request);
        double transactionScore = calculateTransactionScore(request);
        double savingsScore = calculateSavingsScore(request);

        // Default weights
        double alpha = 0.35;
        double beta = 0.25;
        double gamma = 0.20;
        double delta = 0.20;

        // Calculate SBI: normalize to 300-850 range
        double normalizedScore = (alpha * paymentScore + beta * incomeScore +
                gamma * transactionScore + delta * savingsScore);
        int sbiScore = (int) (300 + (normalizedScore / 100.0) * 550);

        return MlModelResponse.builder()
                .predictedScore(sbiScore)
                .scoreCategory(determineScoreCategory(sbiScore))
                .paymentConsistency(paymentScore)
                .incomeReliability(incomeScore)
                .transactionPatterns(transactionScore)
                .savingsStability(savingsScore)
                .alphaWeight(alpha)
                .betaWeight(beta)
                .gammaWeight(gamma)
                .deltaWeight(delta)
                .modelVersion("fallback-v1.0")
                .confidenceLevel(60.0)
                .build();
    }

    private double calculatePaymentScore(MlModelRequest request) {
        // Higher score for fewer delays and delayed payments
        double delayPenalty = Math.min(request.getDelayFromDueDate() * 2, 30);
        double delayedPaymentPenalty = Math.min(request.getNumOfDelayedPayment() * 3, 40);
        return Math.max(0, 100 - delayPenalty - delayedPaymentPenalty);
    }

    private double calculateIncomeScore(MlModelRequest request) {
        // Higher score for higher income and salary
        double incomeRatio = request.getMonthlyInhandSalary() / (request.getAnnualIncome() / 12.0);
        double baseScore = Math.min((request.getAnnualIncome() / 100000.0) * 50, 50);
        double stabilityBonus = incomeRatio > 0.7 ? 30 : 10;
        return Math.min(100, baseScore + stabilityBonus + 20);
    }

    private double calculateTransactionScore(MlModelRequest request) {
        // Score based on investment habits and EMI management
        double investmentScore = Math.min((request.getAmountInvestedMonthly() / request.getMonthlyInhandSalary()) * 100,
                50);
        double emiRatio = request.getTotalEmiPerMonth() / request.getMonthlyInhandSalary();
        double emiScore = emiRatio < 0.4 ? 30 : (emiRatio < 0.6 ? 20 : 10);
        return Math.min(100, investmentScore + emiScore + 20);
    }

    private double calculateSavingsScore(MlModelRequest request) {
        // Score based on balance and utilization
        double utilizationPenalty = request.getCreditUtilizationRatio() > 30
                ? (request.getCreditUtilizationRatio() - 30)
                : 0;
        double balanceScore = Math.min((request.getMonthlyBalance() / request.getMonthlyInhandSalary()) * 50, 50);
        return Math.max(0, Math.min(100, balanceScore + 50 - utilizationPenalty));
    }

    private String determineScoreCategory(int score) {
        if (score >= 750)
            return "Excellent";
        if (score >= 700)
            return "Very Good";
        if (score >= 650)
            return "Good";
        if (score >= 600)
            return "Fair";
        return "Poor";
    }
}
