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

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository     userRepository;
    private final ArtworkRepository  artworkRepository;
    private final ArtworkService     artworkService;

    public List<ArtworkResponse> getWishlist(String email) {
        User user = findUser(email);
        return wishlistRepository.findByUserId(user.getId())
            .stream()
            .map(w -> artworkService.toResponse(w.getArtwork()))
            .toList();
    }

    @Transactional
    public void add(String email, Long artworkId) {
        User user    = findUser(email);
        Artwork art  = artworkRepository.findById(artworkId)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));

        if (wishlistRepository.existsByUserIdAndArtworkId(user.getId(), artworkId)) {
            throw new BadRequestException("Artwork already in wishlist");
        }

        Wishlist wish = Wishlist.builder().user(user).artwork(art).build();
        wishlistRepository.save(wish);
    }

    @Transactional
    public void remove(String email, Long artworkId) {
        User user = findUser(email);
        wishlistRepository.deleteByUserIdAndArtworkId(user.getId(), artworkId);
    }

    public boolean isInWishlist(String email, Long artworkId) {
        User user = findUser(email);
        return wishlistRepository.existsByUserIdAndArtworkId(user.getId(), artworkId);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
