package com.scorebridge.credit_score_sys.modules.ingestion.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.Column;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@Table(name = "ingestion_files")
public class IngestionFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String name;

    @Column(name = "file_uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "file_status", nullable = false)
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Status status;

    @Column(name = "file_error_message", nullable = true)
    private String errorMessage;

    @OneToMany(mappedBy = "ingestionFile", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    @Override
    public String toString() {
        return "IngestionFile [id=" + id + ", name=" + name + ", uploadedAt=" + uploadedAt + ", status=" + status
                + ", errorMessage="
                + errorMessage + "]";
    }
}
