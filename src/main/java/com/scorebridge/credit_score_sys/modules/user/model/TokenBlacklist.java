package com.scorebridge.credit_score_sys.modules.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing a blacklisted JWT token.
 * Tokens are blacklisted upon user logout to prevent their reuse.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Entity
@Table(name = "token_blacklist", indexes = {
        @Index(name = "idx_token", columnList = "token"),
        @Index(name = "idx_expiry_date", columnList = "expiryDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenBlacklist {

    /**
     * Unique identifier for the blacklist entry.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The blacklisted JWT token.
     */
    @Column(nullable = false, length = 1000, unique = true)
    private String token;

    /**
     * The user ID associated with this token.
     */
    @Column(nullable = false)
    private Long userId;

    /**
     * The user's email associated with this token.
     */
    @Column(nullable = false)
    private String userEmail;

    /**
     * The date and time when this token expires.
     * Used for automatic cleanup of expired tokens from the blacklist.
     */
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * The date and time when this token was blacklisted.
     */
    @Column(nullable = false)
    private LocalDateTime blacklistedAt;
}
