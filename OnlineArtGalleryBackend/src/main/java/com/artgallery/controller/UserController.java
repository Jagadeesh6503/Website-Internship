package com.artgallery.controller;

import com.artgallery.dto.UserProfileRequest;
import com.artgallery.dto.UserProfileResponse;
import com.artgallery.exception.ResourceNotFoundException;
import com.artgallery.model.User;
import com.artgallery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * GET  /api/users/me  — return current user's profile
 * PUT  /api/users/me  — update current user's profile
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetails principal) {
        User user = findUser(principal.getUsername());
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody UserProfileRequest req) {
        User user = findUser(principal.getUsername());
        if (req.getFirstName() != null && !req.getFirstName().isBlank()) user.setFirstName(req.getFirstName());
        if (req.getLastName()  != null && !req.getLastName().isBlank())  user.setLastName(req.getLastName());
        if (req.getPhone()     != null) user.setPhone(req.getPhone());
        if (req.getBio()       != null) user.setBio(req.getBio());
        return ResponseEntity.ok(toResponse(userRepository.save(user)));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toResponse(User u) {
        return UserProfileResponse.builder()
            .id(u.getId())
            .firstName(u.getFirstName())
            .lastName(u.getLastName())
            .email(u.getEmail())
            .phone(u.getPhone())
            .bio(u.getBio())
            .avatarUrl(u.getAvatarUrl())
            .role(u.getRole())
            .active(u.isActive())
            .createdAt(u.getCreatedAt())
            .build();
    }
}
