package com.artgallery.repository;

import com.artgallery.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByArtworkId(Long artworkId);
    List<Review> findByUserId(Long userId);
    Optional<Review> findByUserIdAndArtworkId(Long userId, Long artworkId);
    boolean existsByUserIdAndArtworkId(Long userId, Long artworkId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.artwork.id = :artworkId")
    Double getAverageRating(@Param("artworkId") Long artworkId);
}
