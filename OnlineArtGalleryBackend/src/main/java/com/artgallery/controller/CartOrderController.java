package com.artgallery.controller;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.dto.OrderResponse;
import com.artgallery.model.enums.OrderStatus;
import com.artgallery.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CartOrderController {

    private final CartService  cartService;
    private final OrderService orderService;

    // ── Cart ─────────────────────────────────────────────────────

    @GetMapping("/cart")
    public ResponseEntity<List<ArtworkResponse>> getCart(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(cartService.getCart(p.getUsername()));
    }

    @PostMapping("/cart/{artworkId}")
    public ResponseEntity<Map<String,String>> addToCart(
            @PathVariable Long artworkId,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addToCart(p.getUsername(), artworkId));
    }

    @DeleteMapping("/cart/{artworkId}")
    public ResponseEntity<Map<String,String>> removeFromCart(
            @PathVariable Long artworkId,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(cartService.removeFromCart(p.getUsername(), artworkId));
    }

    @DeleteMapping("/cart")
    public ResponseEntity<Map<String,String>> clearCart(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(cartService.clearCart(p.getUsername()));
    }

    // ── Orders ───────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails p,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(p.getUsername(), page, size));
    }

    @PostMapping("/orders/checkout")
    public ResponseEntity<OrderResponse> checkout(
            @AuthenticationPrincipal UserDetails p,
            @RequestParam(required = false) String shippingAddr) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(orderService.checkout(p.getUsername(), shippingAddr));
    }
}
