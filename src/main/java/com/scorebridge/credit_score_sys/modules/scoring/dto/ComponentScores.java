package com.scorebridge.credit_score_sys.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Represents the breakdown of the ScoreBridge Index (SBI) components.
 * SBI = αP + βI + γT + δS
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Component scores for the ScoreBridge Index formula")
public class ComponentScores {

    @Schema(description = "P - Payment consistency score (0-100)", example = "85.5")
    private Double paymentConsistency;

    @Schema(description = "I - Income reliability score (0-100)", example = "72.3")
    private Double incomeReliability;

    @Schema(description = "T - Transaction patterns score (0-100)", example = "68.9")
    private Double transactionPatterns;

    @Schema(description = "S - Savings stability score (0-100)", example = "91.2")
    private Double savingsStability;

    @Schema(description = "Weight α for payment consistency", example = "0.35")
    private Double alphaWeight;

    @Schema(description = "Weight β for income reliability", example = "0.25")
    private Double betaWeight;

    @Schema(description = "Weight γ for transaction patterns", example = "0.20")
    private Double gammaWeight;

    @Schema(description = "Weight δ for savings stability", example = "0.20")
    private Double deltaWeight;
}
