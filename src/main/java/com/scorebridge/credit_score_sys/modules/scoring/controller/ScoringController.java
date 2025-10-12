package com.scorebridge.credit_score_sys.modules.scoring.controller;

import com.scorebridge.credit_score_sys.modules.scoring.dto.InteractiveScoreRequest;
import com.scorebridge.credit_score_sys.modules.scoring.dto.ScoreCalculationResponse;
import com.scorebridge.credit_score_sys.modules.scoring.service.ScoringService;
import com.scorebridge.credit_score_sys.modules.user.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for credit score calculation and history.
 * Provides endpoints for instant scoring and score history retrieval.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Slf4j
@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
@Tag(name = "Scoring", description = "Credit score calculation and history APIs")
public class ScoringController {

    private final ScoringService scoringService;

    /**
     * Calculate credit score based on user's financial data.
     * Works for both anonymous and registered users.
     * 
     * @param request the financial data for scoring
     * @return calculated score with components and recommendations
     */
    @PostMapping("/calculate")
    @Operation(summary = "Calculate Credit Score", description = "Calculate ScoreBridge Index (SBI) based on user's financial data. "
            +
            "Can be used anonymously or with userId to save the score.")
    public ResponseEntity<ApiResponse<ScoreCalculationResponse>> calculateScore(
            @Valid @RequestBody InteractiveScoreRequest request) {

        log.info("Received score calculation request");

        ScoreCalculationResponse response = scoringService.calculateInteractiveScore(request);

        return ResponseEntity.ok(
                ApiResponse.success("Score calculated successfully", response));
    }

    /**
     * Get score history for a registered user.
     * 
     * @param userId the user ID
     * @return list of past score calculations
     */
    @GetMapping("/history/{userId}")
    @Operation(summary = "Get Score History", description = "Retrieve all past credit score calculations for a registered user")
    public ResponseEntity<ApiResponse<List<ScoreCalculationResponse>>> getScoreHistory(
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {

        log.info("Retrieving score history for user: {}", userId);

        List<ScoreCalculationResponse> history = scoringService.getScoreHistory(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        String.format("Found %d score records", history.size()),
                        history));
    }

    /**
     * Get the latest score for a registered user.
     * 
     * @param userId the user ID
     * @return the most recent score calculation
     */
    @GetMapping("/latest/{userId}")
    @Operation(summary = "Get Latest Score", description = "Retrieve the most recent credit score for a registered user")
    public ResponseEntity<ApiResponse<ScoreCalculationResponse>> getLatestScore(
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {

        log.info("Retrieving latest score for user: {}", userId);

        ScoreCalculationResponse score = scoringService.getLatestScore(userId);

        return ResponseEntity.ok(
                ApiResponse.success("Latest score retrieved successfully", score));
    }

    /**
     * Health check endpoint for scoring service.
     * 
     * @return service status
     */
    @GetMapping("/health")
    @Operation(summary = "Health Check", description = "Check if the scoring service is running")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("Scoring service is operational"));
    }
}
