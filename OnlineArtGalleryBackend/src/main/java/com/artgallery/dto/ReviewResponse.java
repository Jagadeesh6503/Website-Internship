package com.artgallery.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/** Review response (public-facing) */
@Data @Builder
public class ReviewResponse {
    private Long   id;
    private Long   userId;
    private String userName;
    private Long   artworkId;
    private String artworkTitle;
    private int    rating;
    private String comment;
    private LocalDateTime createdAt;
}
