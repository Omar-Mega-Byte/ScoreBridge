package com.scorebridge.credit_score_sys.modules.data_ingestion.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.scorebridge.credit_score_sys.modules.user.model.User;

/**
 * Entity class representing a financial account linked to a user.
 * Contains details about the financial institution, account type, and balance.
 * Used for data ingestion and credit score calculations.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "financial_accounts", indexes = {
        @jakarta.persistence.Index(name = "idx_account_number", columnList = "account_number_last4")
})
public class FinancialAccount {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FinancialTransactions> transactions = new ArrayList<>();

    @Column(nullable = false, name = "institution_name")
    private String institutionName;

    @Column(nullable = false, name = "account_type")
    private String accountType;

    @Column(nullable = true, name = "account_number_last4")
    private String accountNumberLast4;

    @Column(nullable = false, name = "current_balance")
    private Double currentBalance;

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
