package com.scorebridge.credit_score_sys.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO from ML model prediction service.
 * Contains predicted score and component details.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MlModelResponse {

    private Integer predictedScore;
    private String scoreCategory;

    // Component scores (0-100)
    private Double paymentConsistency;
    private Double incomeReliability;
    private Double transactionPatterns;
    private Double savingsStability;

    // Weights learned by the model
    private Double alphaWeight;
    private Double betaWeight;
    private Double gammaWeight;
    private Double deltaWeight;

    // Additional metadata
    private String modelVersion;
    private Double confidenceLevel;
}
