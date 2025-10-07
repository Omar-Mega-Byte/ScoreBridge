package com.scorebridge.credit_score_sys.modules.user.service;

import com.scorebridge.credit_score_sys.modules.user.model.User;
import com.scorebridge.credit_score_sys.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

/**
 * Custom implementation of Spring Security's UserDetailsService.
 * Loads user-specific data from the database for authentication and
 * authorization.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a user by their email address.
     * This method is called by Spring Security during authentication.
     *
     * @param email the email address of the user
     * @return UserDetails object containing user information
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new CustomUserPrincipal(user);
    }

    /**
     * Custom implementation of UserDetails for the application.
     * Wraps the User entity and provides authentication information to Spring
     * Security.
     */
    public static class CustomUserPrincipal implements UserDetails {
        private final User user;

        /**
         * Constructs a CustomUserPrincipal from a User entity.
         *
         * @param user the User entity to wrap
         */
        public CustomUserPrincipal(User user) {
            this.user = user;
        }

        /**
         * Returns the authorities granted to the user.
         * All users are assigned the ROLE_USER authority.
         *
         * @return collection of granted authorities
         */
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

        /**
         * Returns the password used to authenticate the user.
         *
         * @return the user's hashed password
         */
        @Override
        public String getPassword() {
            return user.getHashedPassword();
        }

        /**
         * Returns the username used to authenticate the user.
         * In this implementation, the email address is used as the username.
         *
         * @return the user's email address
         */
        @Override
        public String getUsername() {
            return user.getEmail();
        }

        /**
         * Indicates whether the user's account has expired.
         *
         * @return true (account never expires in this implementation)
         */
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        /**
         * Indicates whether the user is locked or unlocked.
         *
         * @return true (accounts are never locked in this implementation)
         */
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        /**
         * Indicates whether the user's credentials have expired.
         *
         * @return true (credentials never expire in this implementation)
         */
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        /**
         * Indicates whether the user is enabled or disabled.
         *
         * @return true (all users are enabled in this implementation)
         */
        @Override
        public boolean isEnabled() {
            return true;
        }

        /**
         * Returns the wrapped User entity.
         *
         * @return the User entity
         */
        public User getUser() {
            return user;
        }

        /**
         * Returns the user's ID.
         *
         * @return the user's ID
         */
        public Long getId() {
            return user.getId();
        }

        /**
         * Returns the user's name.
         *
         * @return the user's name
         */
        public String getName() {
            return user.getName();
        }

        /**
         * Returns the user's email address.
         *
         * @return the user's email address
         */
        public String getEmail() {
            return user.getEmail();
        }
    }
}