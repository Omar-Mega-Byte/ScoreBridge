package com.scorebridge.credit_score_sys.modules.user.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) configuration for the ScoreBridge Credit Score System API.
 * Defines API documentation details, servers, and security schemes.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Configuration
@OpenAPIDefinition(info = @Info(title = "ScoreBridge Credit Score System API", description = "A comprehensive credit scoring system API that provides user management, credit scoring, reporting, and data ingestion capabilities.", version = "v1.0.0", contact = @Contact(name = "ScoreBridge Team", email = "support@scorebridge.com", url = "https://scorebridge.com"), license = @License(name = "MIT License", url = "https://opensource.org/licenses/MIT")), servers = {
                @Server(url = "http://localhost:8080", description = "Development Server"),
                @Server(url = "https://api.scorebridge.com", description = "Production Server")
})
@SecurityScheme(name = "bearerAuth", description = "JWT Bearer Authentication", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {
}