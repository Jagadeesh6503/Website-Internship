package com.artgallery.dto;

import com.artgallery.model.enums.ArtworkStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Response DTO for Artwork — flattened for JSON serialization */
@Data @Builder
public class ArtworkResponse {
    private Long   id;
    private String title;
    private String description;
    private BigDecimal price;
    private String medium;
    private String dimensions;
    private Integer yearCreated;
    private String imageUrl;
    private ArtworkStatus status;
    private boolean available;
    private int viewCount;
    private double averageRating;
    private int reviewCount;

    // Artist info (flattened)
    private Long   artistId;
    private String artistName;

    // Category info
    private Long   categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
}
