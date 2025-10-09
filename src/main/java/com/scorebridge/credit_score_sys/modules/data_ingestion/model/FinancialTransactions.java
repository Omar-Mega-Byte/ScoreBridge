package com.scorebridge.credit_score_sys.modules.data_ingestion.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;

/**
 * Entity class representing a financial transaction linked to a financial
 * account.
 * Contains details about the transaction amount, type, category, and
 * description.
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
@Table(name = "financial_transactions", indexes = {
        @jakarta.persistence.Index(name = "idx_transaction_date", columnList = "transaction_date"),
        @jakarta.persistence.Index(name = "idx_account_id", columnList = "account_id")
})
public class FinancialTransactions {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @ManyToOne(optional = false, fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private FinancialAccount account;

    @Column(nullable = false, name = "amount")
    private Double amount;

    @Column(nullable = false, name = "transaction_type", length = 20)
    private String transactionType;

    @Column(nullable = false, name = "category", length = 100)
    private String category;

    @Column(nullable = true, name = "description", length = 255)
    private String description;

    @Column(nullable = false, name = "transaction_date")
    private java.time.LocalDate transactionDate;
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
