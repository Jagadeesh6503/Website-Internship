package com.artgallery.service;

import com.artgallery.dto.ArtworkResponse;
import com.artgallery.exception.BadRequestException;
import com.artgallery.exception.ResourceNotFoundException;
import com.artgallery.model.*;
import com.artgallery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository    cartRepository;
    private final UserRepository    userRepository;
    private final ArtworkRepository artworkRepository;
    private final ArtworkService    artworkService;

    /** Get or create a cart for the user, return items */
    public List<ArtworkResponse> getCart(String email) {
        User user = findUser(email);
        Cart cart = getOrCreateCart(user);
        return cart.getItems().stream()
            .map(ci -> artworkService.toResponse(ci.getArtwork()))
            .toList();
    }

    @Transactional
    public Map<String, String> addToCart(String email, Long artworkId) {
        User user    = findUser(email);
        Artwork art  = artworkRepository.findById(artworkId)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));

        if (!art.isAvailable()) {
            throw new BadRequestException("Artwork is not available for purchase");
        }

        Cart cart = getOrCreateCart(user);
        boolean exists = cart.getItems().stream()
            .anyMatch(ci -> ci.getArtwork().getId().equals(artworkId));
        if (exists) {
            throw new BadRequestException("Artwork already in cart");
        }

        CartItem item = CartItem.builder().cart(cart).artwork(art).quantity(1).build();
        cart.getItems().add(item);
        cartRepository.save(cart);
        return Map.of("message", "Added to cart");
    }

    @Transactional
    public Map<String, String> removeFromCart(String email, Long artworkId) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(ci -> ci.getArtwork().getId().equals(artworkId));
        cartRepository.save(cart);
        return Map.of("message", "Removed from cart");
    }

    @Transactional
    public Map<String, String> clearCart(String email) {
        User user = findUser(email);
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
        return Map.of("message", "Cart cleared");
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
            .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
