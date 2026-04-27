package com.artgallery.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/** Request for adding a review */
@Data
public class ReviewRequest {

    @NotNull
    private Long artworkId;

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}
