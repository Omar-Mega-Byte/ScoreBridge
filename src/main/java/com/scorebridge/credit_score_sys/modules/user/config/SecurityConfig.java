package com.scorebridge.credit_score_sys.modules.user.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for the application.
 * Configures JWT-based authentication, authorization rules, CORS settings, and
 * password encoding.
 * All authenticated users have the USER role only.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:5173}")
        private String allowedOrigins;

        /**
         * Configures the security filter chain for HTTP requests.
         * Sets up JWT authentication, CORS, CSRF protection, session management, and
         * authorization rules.
         *
         * @param http the HttpSecurity to configure
         * @return the configured SecurityFilterChain
         * @throws Exception if an error occurs during configuration
         */
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // Disable CSRF for API endpoints
                                .csrf(AbstractHttpConfigurer::disable)

                                // Configure CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // Configure session management - stateless for JWT
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Configure authorization rules
                                .authorizeHttpRequests(authz -> authz
                                                // Public endpoints
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/api/public/**",
                                                                "/api/score/**", // Scoring endpoints (support anonymous
                                                                                 // + authenticated)
                                                                "/h2-console/**",
                                                                "/actuator/health",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui.html")
                                                .permitAll()

                                                // All other endpoints require authentication (USER role only)
                                                .anyRequest().authenticated())

                                // Configure headers for H2 console (development only)
                                .headers(headers -> headers
                                                .frameOptions(frameOptions -> frameOptions.sameOrigin()));

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        /**
         * Configures the password encoder for hashing user passwords.
         * Uses BCrypt with a strength of 12 for secure password hashing.
         *
         * @return the PasswordEncoder bean
         */
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12);
        }

        /**
         * Provides the AuthenticationManager bean for authenticating users.
         *
         * @param authenticationConfiguration the authentication configuration
         * @return the AuthenticationManager bean
         * @throws Exception if an error occurs during configuration
         */
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration authenticationConfiguration) throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        /**
         * Configures CORS (Cross-Origin Resource Sharing) settings for the application.
         * Reads allowed origins from environment variable (cors.allowed-origins).
         * Supports wildcard patterns for flexible origin matching.
         *
         * @return the CorsConfigurationSource bean
         */
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Parse allowed origins from environment variable (comma-separated)
                List<String> origins = Arrays.asList(allowedOrigins.split(","));

                // Use setAllowedOriginPatterns to support wildcards with credentials
                configuration.setAllowedOriginPatterns(origins);

                // Allow common HTTP methods
                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Allow all headers (for Swagger and API clients)
                configuration.setAllowedHeaders(List.of("*"));

                // Allow credentials (required for JWT)
                configuration.setAllowCredentials(true);

                // Expose Authorization header
                configuration.setExposedHeaders(List.of("Authorization"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

}