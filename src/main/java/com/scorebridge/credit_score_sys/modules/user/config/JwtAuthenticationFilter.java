package com.scorebridge.credit_score_sys.modules.user.config;

import com.scorebridge.credit_score_sys.modules.user.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT authentication filter that processes incoming requests.
 * Extracts and validates JWT tokens from the Authorization header,
 * checks if the token is blacklisted, and sets the authentication in the Spring
 * Security context.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Filters each HTTP request to validate JWT tokens and set authentication.
     * Extracts the JWT from the Authorization header, validates it,
     * and sets the authentication in the security context if valid.
     *
     * @param request     the HTTP request
     * @param response    the HTTP response
     * @param filterChain the filter chain
     * @throws ServletException if a servlet error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Check if Authorization header is present and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token from Authorization header
        jwt = authHeader.substring(7);

        try {
            // Check if token is blacklisted (user has logged out)
            if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
                log.warn("Attempted to use blacklisted token");
                filterChain.doFilter(request, response);
                return;
            }

            userEmail = jwtUtil.extractUsername(jwt);

            // If username is extracted and no authentication is set in context
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Determines if this filter should be skipped for the given request.
     * Public endpoints like /api/auth/**, /swagger-ui/**, etc. are excluded from
     * JWT filtering.
     *
     * @param request the HTTP request
     * @return true if the filter should be skipped, false otherwise
     * @throws ServletException if a servlet error occurs
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Skip JWT filter for public endpoints
        return path.startsWith("/api/auth/") ||
                path.startsWith("/api/public/") ||
                path.startsWith("/h2-console/") ||
                path.startsWith("/actuator/health") ||
                path.startsWith("/swagger-ui/") ||
                path.startsWith("/v3/api-docs/") ||
                path.equals("/swagger-ui.html");
    }
}