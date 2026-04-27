package com.artgallery.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/** Request body for POST /api/auth/login */
@Data
public class LoginRequest {
    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;
}
