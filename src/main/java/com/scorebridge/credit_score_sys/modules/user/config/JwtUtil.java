package com.scorebridge.credit_score_sys.modules.user.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT (JSON Web Token) operations.
 * Handles token generation, validation, and extraction of claims.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Component
public class JwtUtil {

    /**
     * Secret key used for signing JWT tokens.
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * JWT token expiration time in milliseconds.
     */
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Generates the secret key for signing JWT tokens.
     *
     * @return the SecretKey for HMAC signing
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Extracts the username (subject) from a JWT token.
     *
     * @param token the JWT token
     * @return the username
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from a JWT token.
     *
     * @param token the JWT token
     * @return the expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from a JWT token.
     *
     * @param <T>            the type of the claim
     * @param token          the JWT token
     * @param claimsResolver function to resolve the claim
     * @return the extracted claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a JWT token.
     *
     * @param token the JWT token
     * @return all claims from the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Checks if a JWT token has expired.
     *
     * @param token the JWT token
     * @return true if the token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a JWT token for a user.
     *
     * @param userDetails the user details
     * @return the generated JWT token
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Generates a JWT token for a username.
     *
     * @param username the username
     * @return the generated JWT token
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    /**
     * Generates a JWT token with additional claims.
     *
     * @param userDetails the user details
     * @param extraClaims additional claims to include in the token
     * @return the generated JWT token
     */
    public String generateToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        Map<String, Object> claims = new HashMap<>(extraClaims);
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Creates a JWT token with the specified claims and subject.
     *
     * @param claims  the claims to include in the token
     * @param subject the subject (username) of the token
     * @return the generated JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates a JWT token against user details.
     *
     * @param token       the JWT token
     * @param userDetails the user details to validate against
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Validates a JWT token without user details.
     *
     * @param token the JWT token
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Refreshes a JWT token by creating a new token with the same subject.
     *
     * @param token the existing JWT token
     * @return a new JWT token with updated expiration
     */
    public String refreshToken(String token) {
        final Claims claims = extractAllClaims(token);
        return createToken(new HashMap<>(), claims.getSubject());
    }
}