package com.artgallery.dto;

import com.artgallery.model.enums.ArtworkStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

/** Request body for creating/updating an artwork */
@Data
public class ArtworkRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal price;

    private String medium;
    private String dimensions;
    private Integer yearCreated;
    private Long categoryId;
    private boolean available = true;
    private ArtworkStatus status;
}
