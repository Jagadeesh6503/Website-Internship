package com.artgallery.service;

import com.artgallery.dto.*;
import com.artgallery.exception.BadRequestException;
import com.artgallery.model.User;
import com.artgallery.repository.UserRepository;
import com.artgallery.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles user registration and login, issues JWT tokens
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository     userRepository;
    private final PasswordEncoder    passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider   jwtTokenProvider;

    /** Register a new user and return a JWT */
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already in use: " + req.getEmail());
        }

        User user = User.builder()
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(req.getRole())
            .isActive(true)
            .build();
        userRepository.save(user);

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return buildResponse(token, user);
    }

    /** Authenticate credentials and return a JWT */
    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtTokenProvider.generateToken(auth);
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadRequestException("User not found"));
        return buildResponse(token, user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.builder()
            .token(token)
            .type("Bearer")
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
