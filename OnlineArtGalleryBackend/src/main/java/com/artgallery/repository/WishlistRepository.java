package com.artgallery.repository;

import com.artgallery.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndArtworkId(Long userId, Long artworkId);
    boolean existsByUserIdAndArtworkId(Long userId, Long artworkId);
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}
