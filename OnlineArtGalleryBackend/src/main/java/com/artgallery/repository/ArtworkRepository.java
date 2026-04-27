package com.artgallery.repository;

import com.artgallery.model.Artwork;
import com.artgallery.model.enums.ArtworkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    Page<Artwork> findByStatus(ArtworkStatus status, Pageable pageable);

    Page<Artwork> findByStatusAndIsAvailable(ArtworkStatus status, boolean available, Pageable pageable);

    Page<Artwork> findByArtistId(Long artistId, Pageable pageable);

    Page<Artwork> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("""
        SELECT a FROM Artwork a
        WHERE a.status = 'ACTIVE'
          AND (:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%',:search,'%'))
              OR LOWER(a.artist.firstName) LIKE LOWER(CONCAT('%',:search,'%'))
              OR LOWER(a.artist.lastName)  LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:categoryId IS NULL OR a.category.id = :categoryId)
          AND (:minPrice IS NULL OR a.price >= :minPrice)
          AND (:maxPrice IS NULL OR a.price <= :maxPrice)
    """)
    Page<Artwork> search(
        @Param("search")     String search,
        @Param("categoryId") Long categoryId,
        @Param("minPrice")   BigDecimal minPrice,
        @Param("maxPrice")   BigDecimal maxPrice,
        Pageable pageable
    );

    List<Artwork> findTop8ByStatusOrderByCreatedAtDesc(ArtworkStatus status);

    Long countByStatus(ArtworkStatus status);
}
