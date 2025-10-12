package com.scorebridge.credit_score_sys.modules.scoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

/**
 * Response DTO containing the calculated credit score and its components.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Complete credit score calculation result")
public class ScoreCalculationResponse {

    @Schema(description = "The ScoreBridge Index (SBI) score (300-850)", example = "720")
    private Integer sbiScore;

    @Schema(description = "Credit score category", example = "Good", allowableValues = { "Poor", "Fair", "Good",
            "Very Good", "Excellent" })
    private String scoreCategory;

    @Schema(description = "Breakdown of component scores")
    private ComponentScores components;

    @Schema(description = "Risk level assessment", example = "Low Risk", allowableValues = { "Low Risk",
            "Moderate Risk", "High Risk" })
    private String riskLevel;

    @Schema(description = "Brief explanation of the score")
    private String explanation;

    @Schema(description = "Recommendations for improvement")
    private String recommendations;

    @Schema(description = "Timestamp when the score was calculated")
    private LocalDateTime calculatedAt;

    @Schema(description = "ML model version used", example = "v1.0")
    private String modelVersion;

    @Schema(description = "Whether the score was saved for registered user")
    private Boolean saved;

    @Schema(description = "Confidence level of the prediction (0-100)", example = "92.5")
    private Double confidenceLevel;
}
