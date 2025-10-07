package com.scorebridge.credit_score_sys.modules.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.annotation.LastModifiedDate;
import lombok.NoArgsConstructor;

/**
 * Entity class representing a user in the system.
 * Contains basic user information and authentication credentials.
 * All users have the USER role by default.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users", indexes = {
        @jakarta.persistence.Index(name = "idx_user_email", columnList = "email")
})
public class User {

    /**
     * Unique identifier for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Full name of the user.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Email address of the user. Used as the username for authentication.
     * Must be unique across the system.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * BCrypt hashed password for user authentication.
     */
    @Column(nullable = false)
    private String hashedPassword;

    /**
     * Timestamp when the user account was created.
     * Automatically set by JPA auditing.
     */
    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the user account was last updated.
     * Automatically updated by JPA auditing.
     */
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
