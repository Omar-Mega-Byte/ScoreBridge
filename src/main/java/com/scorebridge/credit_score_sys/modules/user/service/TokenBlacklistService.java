package com.scorebridge.credit_score_sys.modules.user.service;

import com.scorebridge.credit_score_sys.modules.user.config.JwtUtil;
import com.scorebridge.credit_score_sys.modules.user.model.TokenBlacklist;
import com.scorebridge.credit_score_sys.modules.user.model.User;
import com.scorebridge.credit_score_sys.modules.user.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * Service class for managing JWT token blacklisting.
 * Handles adding tokens to the blacklist and checking if tokens are
 * blacklisted.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final JwtUtil jwtUtil;

    /**
     * Adds a token to the blacklist.
     *
     * @param token the JWT token to blacklist
     * @param user  the user associated with the token
     */
    @Transactional
    public void blacklistToken(String token, User user) {
        // Check if token is already blacklisted
        if (tokenBlacklistRepository.existsByToken(token)) {
            log.debug("Token already blacklisted for user: {}", user.getEmail());
            return;
        }

        // Extract expiration date from token
        Date expirationDate = jwtUtil.extractExpiration(token);
        LocalDateTime expiryDateTime = expirationDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        // Create blacklist entry
        TokenBlacklist blacklistEntry = TokenBlacklist.builder()
                .token(token)
                .userId(user.getId())
                .userEmail(user.getEmail())
                .expiryDate(expiryDateTime)
                .blacklistedAt(LocalDateTime.now())
                .build();

        tokenBlacklistRepository.save(blacklistEntry);
        log.info("Token blacklisted for user: {}", user.getEmail());
    }

    /**
     * Checks if a token is blacklisted.
     *
     * @param token the JWT token to check
     * @return true if the token is blacklisted, false otherwise
     */
    public boolean isTokenBlacklisted(String token) {
        boolean isBlacklisted = tokenBlacklistRepository.existsByToken(token);
        log.debug("Token blacklist check: {}", isBlacklisted);
        return isBlacklisted;
    }

    /**
     * Removes expired tokens from the blacklist.
     * This method is scheduled to run daily at 2:00 AM to clean up expired tokens.
     * Expired tokens are automatically invalid and don't need to be checked.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2:00 AM
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        long expiredCount = tokenBlacklistRepository.countExpiredTokens(now);

        if (expiredCount > 0) {
            int deletedCount = tokenBlacklistRepository.deleteExpiredTokens(now);
            log.info("Cleaned up {} expired tokens from blacklist", deletedCount);
        } else {
            log.debug("No expired tokens to clean up");
        }
    }

    /**
     * Manually triggers cleanup of expired tokens.
     * Useful for administrative purposes or testing.
     *
     * @return the number of tokens removed from the blacklist
     */
    @Transactional
    public int forceCleanup() {
        LocalDateTime now = LocalDateTime.now();
        int deletedCount = tokenBlacklistRepository.deleteExpiredTokens(now);
        log.info("Forced cleanup: removed {} expired tokens", deletedCount);
        return deletedCount;
    }
}
