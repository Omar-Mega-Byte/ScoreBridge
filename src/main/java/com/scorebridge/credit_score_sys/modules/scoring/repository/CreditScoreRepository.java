package com.scorebridge.credit_score_sys.modules.scoring.repository;

import com.scorebridge.credit_score_sys.modules.scoring.model.CreditScore;
import com.scorebridge.credit_score_sys.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for CreditScore entity operations.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Repository
public interface CreditScoreRepository extends JpaRepository<CreditScore, Long> {

    /**
     * Find all scores for a specific user, ordered by calculation date descending.
     */
    List<CreditScore> findByUserOrderByCalculatedAtDesc(User user);

    /**
     * Find the latest score for a specific user.
     */
    Optional<CreditScore> findFirstByUserOrderByCalculatedAtDesc(User user);

    /**
     * Find scores for a user within a date range.
     */
    @Query("SELECT cs FROM CreditScore cs WHERE cs.user = :user " +
            "AND cs.calculatedAt BETWEEN :startDate AND :endDate " +
            "ORDER BY cs.calculatedAt DESC")
    List<CreditScore> findByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Count total scores calculated for a user.
     */
    long countByUser(User user);

    /**
     * Find scores by score category.
     */
    List<CreditScore> findByScoreCategory(String scoreCategory);

    /**
     * Get average ScoreBridge Index (SBI) score for a user.
     */
    @Query("SELECT AVG(cs.sbiScore) FROM CreditScore cs WHERE cs.user = :user")
    Optional<Double> getAverageSbiScoreByUser(@Param("user") User user);
}
