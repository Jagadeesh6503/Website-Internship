package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/artwork/{artworkId}")
    public ResponseEntity<List<ReviewResponse>> getForArtwork(@PathVariable Long artworkId) {
        return ResponseEntity.ok(reviewService.getForArtwork(artworkId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(@AuthenticationPrincipal UserDetails principal) {
        // TODO: look up userId from email
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> create(
            @Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(reviewService.create(principal.getUsername(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        reviewService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
