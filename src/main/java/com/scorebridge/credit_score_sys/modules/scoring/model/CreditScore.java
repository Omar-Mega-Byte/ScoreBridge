package com.scorebridge.credit_score_sys.modules.scoring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.scorebridge.credit_score_sys.modules.user.model.User;

import java.time.LocalDateTime;

/**
 * Entity representing a calculated credit score.
 * Stores the ScoreBridge Index (SBI) and its component scores.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "credit_scores", indexes = {
        @Index(name = "idx_user_calculated", columnList = "user_id,calculated_at")
})
public class CreditScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false, name = "sbi_score")
    private Integer sbiScore;

    @Column(nullable = false, name = "score_category", length = 50)
    private String scoreCategory;

    // Component scores
    @Column(name = "component_p")
    private Double componentP;

    @Column(name = "component_i")
    private Double componentI;

    @Column(name = "component_t")
    private Double componentT;

    @Column(name = "component_s")
    private Double componentS;

    // Weights used
    @Column(name = "alpha_weight")
    private Double alphaWeight;

    @Column(name = "beta_weight")
    private Double betaWeight;

    @Column(name = "gamma_weight")
    private Double gammaWeight;

    @Column(name = "delta_weight")
    private Double deltaWeight;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "confidence_level")
    private Double confidenceLevel;

    @Column(name = "risk_level", length = 50)
    private String riskLevel;

    @CreatedDate
    @Column(nullable = false, name = "calculated_at")
    private LocalDateTime calculatedAt;

    // Input features snapshot for reference
    @Column(name = "annual_income")
    private Double annualIncome;

    @Column(name = "monthly_balance")
    private Double monthlyBalance;

    @Column(name = "outstanding_debt")
    private Double outstandingDebt;

    @Column(name = "credit_utilization_ratio")
    private Double creditUtilizationRatio;
}
