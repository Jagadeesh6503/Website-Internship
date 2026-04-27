package com.artgallery.service;

import com.artgallery.dto.ReviewRequest;
import com.artgallery.dto.ReviewResponse;
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
public class ReviewService {

    private final ReviewRepository  reviewRepository;
    private final UserRepository    userRepository;
    private final ArtworkRepository artworkRepository;

    public List<ReviewResponse> getForArtwork(Long artworkId) {
        return reviewRepository.findByArtworkId(artworkId)
                               .stream().map(this::toResponse).toList();
    }

    public List<ReviewResponse> getByUser(Long userId) {
        return reviewRepository.findByUserId(userId)
                               .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ReviewResponse create(String email, ReviewRequest req) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Artwork artwork = artworkRepository.findById(req.getArtworkId())
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));

        if (reviewRepository.existsByUserIdAndArtworkId(user.getId(), artwork.getId())) {
            throw new BadRequestException("You have already reviewed this artwork");
        }

        Review review = Review.builder()
            .user(user).artwork(artwork)
            .rating(req.getRating()).comment(req.getComment())
            .build();
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long reviewId, String email) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!review.getUser().getId().equals(user.getId())
                && !user.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Not authorized to delete this review");
        }
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
            .id(r.getId())
            .userId(r.getUser().getId())
            .userName(r.getUser().getFullName())
            .artworkId(r.getArtwork().getId())
            .artworkTitle(r.getArtwork().getTitle())
            .rating(r.getRating())
            .comment(r.getComment())
            .createdAt(r.getCreatedAt())
            .build();
    }
}
