package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.model.User;
import com.artgallery.model.enums.ArtworkStatus;
import com.artgallery.model.enums.OrderStatus;
import com.artgallery.repository.*;
import com.artgallery.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Admin-only management endpoints
 * All routes require ROLE_ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository    userRepository;
    private final ArtworkService    artworkService;
    private final ArtworkRepository artworkRepository;
    private final OrderService      orderService;
    private final ReviewRepository  reviewRepository;

    // ── Dashboard stats ──────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String,Object>> stats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers",     userRepository.count(),
            "totalArtworks",  artworkRepository.count(),
            "totalOrders",    orderService.getAllOrders(0,1).getTotalElements(),
            "pendingArtworks",artworkRepository.countByStatus(ArtworkStatus.PENDING),
            "totalReviews",   reviewRepository.count()
        ));
    }

    // ── Users ────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "20")  int size) {
        // Hide passwords in response (handled by @JsonIgnore on entity in production)
        return ResponseEntity.ok(userRepository.findAll(PageRequest.of(page, size)));
    }

    @PatchMapping("/users/{id}/activate")
    public ResponseEntity<Map<String,String>> toggleUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new com.artgallery.exception.ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("status", user.isActive() ? "activated" : "suspended"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Artworks ─────────────────────────────────────────────────

    @GetMapping("/artworks/pending")
    public ResponseEntity<List<ArtworkResponse>> getPending() {
        return ResponseEntity.ok(
            artworkRepository.findByStatus(ArtworkStatus.PENDING, Pageable.unpaged())
                             .map(artworkService::toResponse).toList()
        );
    }

    @PatchMapping("/artworks/{id}/approve")
    public ResponseEntity<ArtworkResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.setStatus(id, ArtworkStatus.ACTIVE));
    }

    @PatchMapping("/artworks/{id}/reject")
    public ResponseEntity<ArtworkResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.setStatus(id, ArtworkStatus.REJECTED));
    }

    // ── Orders ───────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    // ── Reviews ──────────────────────────────────────────────────

    @GetMapping("/reviews")
    public ResponseEntity<List<?>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
