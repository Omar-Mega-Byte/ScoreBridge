package com.scorebridge.credit_score_sys.modules.ingestion.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;

@Data
@Entity
@AllArgsConstructor
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    @Column(name = "transaction_description", nullable = true)
    private String description;

    @Positive
    @Column(name = "transaction_amount", nullable = false)
    private Double amount;

    @Column(name = "transaction_user_identifier", length = 100, nullable = true)
    private String userIdentifier;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime date;

    @Column(name = "transaction_currency", nullable = false)
    private String currency;

    @Column(name = "transaction_type", nullable = false)
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private TransactionType type;

    @Column(name = "transaction_status", nullable = false)
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "file_id", nullable = false)
    private IngestionFile ingestionFile;

    @Override
    public String toString() {
        return "Transaction [id=" + id + ", description=" + description + ", amount=" + amount + ", userIdentifier="
                + userIdentifier + ", date=" + date + ", currency=" + currency + ", type=" + type + ", status="
                + status + ", ingestionFile=" + (ingestionFile != null ? ingestionFile.getId() : null) + "]";
    }
}
