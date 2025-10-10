package com.scorebridge.credit_score_sys.modules.user.service;

import com.scorebridge.credit_score_sys.modules.user.config.JwtUtil;
import com.scorebridge.credit_score_sys.modules.user.dto.JwtResponse;
import com.scorebridge.credit_score_sys.modules.user.dto.LoginRequest;
import com.scorebridge.credit_score_sys.modules.user.dto.RegisterRequest;
import com.scorebridge.credit_score_sys.modules.user.exception.InvalidCredentialsException;
import com.scorebridge.credit_score_sys.modules.user.exception.InvalidTokenException;
import com.scorebridge.credit_score_sys.modules.user.exception.UserAlreadyExistsException;
import com.scorebridge.credit_score_sys.modules.user.model.User;
import com.scorebridge.credit_score_sys.modules.user.repository.UserRepository;
import com.scorebridge.credit_score_sys.modules.user.validation.UserValidation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service class handling authentication and user registration operations.
 * Contains business logic for user registration, login, token refresh, and
 * validation.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserValidation userValidation;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Registers a new user in the system.
     * Validates the registration request, checks for existing users, creates a new
     * user,
     * and generates a JWT token for immediate authentication.
     *
     * @param request the registration request containing user details
     * @return JwtResponse containing the JWT token and user information
     * @throws UserAlreadyExistsException if a user with the provided email already
     *                                    exists
     */
    @Transactional
    public JwtResponse registerUser(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        // Validate the registration request
        userValidation.validateRegisterRequest(request);

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} already exists", request.getEmail());
            throw new UserAlreadyExistsException("Email is already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtUtil.generateToken(userDetails);

        // Build response
        return buildJwtResponse(savedUser, jwt);
    }

    /**
     * Authenticates a user with email and password credentials.
     * Validates the login request and generates a JWT token upon successful
     * authentication.
     *
     * @param request the login request containing user credentials
     * @return JwtResponse containing the JWT token and user information
     * @throws InvalidCredentialsException if the credentials are invalid
     */
    public JwtResponse loginUser(LoginRequest request) {
        log.info("Attempting to authenticate user with email: {}", request.getEmail());

        // Validate the login request
        userValidation.validateLoginRequest(request);

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()));

            // Get user details
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = (CustomUserDetailsService.CustomUserPrincipal) authentication
                    .getPrincipal();

            // Generate JWT token
            String jwt = jwtUtil.generateToken(userPrincipal);

            log.info("User authenticated successfully: {}", userPrincipal.getEmail());

            // Build response
            return buildJwtResponse(userPrincipal.getUser(), jwt);

        } catch (BadCredentialsException e) {
            log.warn("Authentication failed for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    /**
     * Refreshes a JWT token by generating a new token with updated expiration.
     * Validates the existing token before generating a new one.
     *
     * @param authHeader the authorization header containing the Bearer token
     * @return JwtResponse containing the new JWT token and user information
     * @throws InvalidTokenException if the token is invalid or expired
     */
    public JwtResponse refreshToken(String authHeader) {
        log.info("Attempting to refresh token");

        // Extract and validate token
        String token = userValidation.extractToken(authHeader);

        if (!jwtUtil.validateToken(token)) {
            log.warn("Token refresh failed: Invalid or expired token");
            throw new InvalidTokenException("Invalid or expired token");
        }

        // Extract username and load user details
        String username = jwtUtil.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Generate new token
        String newToken = jwtUtil.generateToken(userDetails);

        CustomUserDetailsService.CustomUserPrincipal userPrincipal = (CustomUserDetailsService.CustomUserPrincipal) userDetails;

        log.info("Token refreshed successfully for user: {}", userPrincipal.getEmail());

        // Build response
        return buildJwtResponse(userPrincipal.getUser(), newToken);
    }

    /**
     * Validates a JWT token and returns its validity status.
     *
     * @param authHeader the authorization header containing the Bearer token
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String authHeader) {
        try {
            if (!userValidation.isValidAuthHeader(authHeader)) {
                return false;
            }

            String token = userValidation.extractToken(authHeader);
            boolean isValid = jwtUtil.validateToken(token);

            log.debug("Token validation result: {}", isValid);
            return isValid;

        } catch (Exception e) {
            log.error("Token validation error", e);
            return false;
        }
    }

    /**
     * Logs out a user by blacklisting their JWT token.
     * Once blacklisted, the token cannot be used for authentication.
     *
     * @param authHeader the authorization header containing the Bearer token
     * @throws InvalidTokenException if the token is invalid or already blacklisted
     */
    @Transactional
    public void logoutUser(String authHeader) {
        log.info("Attempting to logout user");

        // Extract and validate token
        String token = userValidation.extractToken(authHeader);

        if (!jwtUtil.validateToken(token)) {
            log.warn("Logout failed: Invalid or expired token");
            throw new InvalidTokenException("Invalid or expired token");
        }

        // Check if token is already blacklisted
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            log.warn("Logout failed: Token already blacklisted");
            throw new InvalidTokenException("Token is already invalidated");
        }

        // Extract username and get user
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new InvalidTokenException("User not found for token"));

        // Blacklist the token
        tokenBlacklistService.blacklistToken(token, user);

        log.info("User logged out successfully: {}", user.getEmail());
    }

    /**
     * Helper method to build a JwtResponse from a User entity and JWT token.
     *
     * @param user  the User entity
     * @param token the JWT token
     * @return JwtResponse containing the token and user information
     */
    private JwtResponse buildJwtResponse(User user, String token) {
        JwtResponse.UserInfo userInfo = JwtResponse.UserInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();

        return JwtResponse.builder()
                .token(token)
                .user(userInfo)
                .build();
    }
}
