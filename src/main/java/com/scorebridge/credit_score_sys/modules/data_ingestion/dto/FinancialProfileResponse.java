package com.scorebridge.credit_score_sys.modules.data_ingestion.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for the response after successfully saving a financial
 * profile.
 * Contains summary information about the saved profile.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialProfileResponse {

    /**
     * ID of the user who owns this profile.
     */
    private Long userId;

    /**
     * List of saved account IDs.
     */
    private List<Long> accountIds;

    /**
     * Total number of accounts saved.
     */
    private Integer totalAccounts;

    /**
     * Total number of transactions saved.
     */
    private Integer totalTransactions;

    /**
     * Total balance across all accounts.
     */
    private Double totalBalance;

    /**
     * Timestamp when the profile was saved.
     */
    private LocalDateTime savedAt;

    /**
     * Success message.
     */
    private String message;
}
