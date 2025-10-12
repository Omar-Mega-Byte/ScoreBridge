package com.scorebridge.credit_score_sys.modules.scoring.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for ML model service.
 * 
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-12
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ml.service")
public class MlModelConfig {

    private String url = "http://localhost:5000";
    private String predictEndpoint = "/predict";
    private int timeoutSeconds = 10;
    private int maxRetries = 3;
    private boolean fallbackEnabled = true;
}
