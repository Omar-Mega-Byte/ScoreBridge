package com.scorebridge.credit_score_sys.modules.user.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI (Swagger) configuration for the ScoreBridge Credit Score System API.
 * Defines API documentation details, servers, and security schemes.
 * Automatically uses the correct server URL based on environment.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Configuration
@SecurityScheme(name = "bearerAuth", description = "JWT Bearer Authentication", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${swagger.server.url:}")
    private String productionUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("ScoreBridge Credit Score System API")
                        .description(
                                "A comprehensive credit scoring system API that provides user management, credit scoring, reporting, and data ingestion capabilities.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("ScoreBridge Team")
                                .email("support@scorebridge.com")
                                .url("https://scorebridge.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));

        // Add servers based on environment
        if (productionUrl != null && !productionUrl.isEmpty()) {
            // Production environment
            openAPI.servers(List.of(
                    new Server().url(productionUrl).description("Production Server"),
                    new Server().url("http://localhost:" + serverPort).description("Development Server")));
        } else {
            // Development environment
            openAPI.servers(List.of(
                    new Server().url("http://localhost:" + serverPort).description("Development Server")));
        }

        return openAPI;
    }
}