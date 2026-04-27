package com.artgallery.controller;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ArtworkResponse>> getWishlist(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(wishlistService.getWishlist(principal.getUsername()));
    }

    @PostMapping("/{artworkId}")
    public ResponseEntity<Map<String,String>> add(
            @PathVariable Long artworkId,
            @AuthenticationPrincipal UserDetails principal) {
        wishlistService.add(principal.getUsername(), artworkId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message","Added to wishlist"));
    }

    @DeleteMapping("/{artworkId}")
    public ResponseEntity<Void> remove(
            @PathVariable Long artworkId,
            @AuthenticationPrincipal UserDetails principal) {
        wishlistService.remove(principal.getUsername(), artworkId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{artworkId}/check")
    public ResponseEntity<Map<String,Boolean>> check(
            @PathVariable Long artworkId,
            @AuthenticationPrincipal UserDetails principal) {
        boolean inList = wishlistService.isInWishlist(principal.getUsername(), artworkId);
        return ResponseEntity.ok(Map.of("inWishlist", inList));
    }
}
