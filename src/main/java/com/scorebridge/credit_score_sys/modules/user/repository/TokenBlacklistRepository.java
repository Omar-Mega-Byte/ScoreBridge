package com.scorebridge.credit_score_sys.modules.user.repository;

import com.scorebridge.credit_score_sys.modules.user.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository interface for TokenBlacklist entity.
 * Provides data access methods for managing blacklisted tokens.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Repository
public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {

    /**
     * Checks if a token exists in the blacklist.
     *
     * @param token the JWT token to check
     * @return true if the token is blacklisted, false otherwise
     */
    boolean existsByToken(String token);

    /**
     * Finds a blacklist entry by token.
     *
     * @param token the JWT token to search for
     * @return Optional containing the TokenBlacklist entry if found
     */
    Optional<TokenBlacklist> findByToken(String token);

    /**
     * Deletes all blacklisted tokens that have expired.
     * Used for periodic cleanup of the blacklist table.
     *
     * @param now the current date and time
     * @return the number of deleted entries
     */
    @Modifying
    @Query("DELETE FROM TokenBlacklist tb WHERE tb.expiryDate < :now")
    int deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Counts the number of expired tokens in the blacklist.
     *
     * @param now the current date and time
     * @return the count of expired tokens
     */
    @Query("SELECT COUNT(tb) FROM TokenBlacklist tb WHERE tb.expiryDate < :now")
    long countExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Finds all blacklist entries for a specific user.
     *
     * @param userId the user ID
     * @return list of blacklisted tokens for the user
     */
    @Query("SELECT tb FROM TokenBlacklist tb WHERE tb.userId = :userId ORDER BY tb.blacklistedAt DESC")
    java.util.List<TokenBlacklist> findByUserId(@Param("userId") Long userId);
}
