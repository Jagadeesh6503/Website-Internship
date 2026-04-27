package com.artgallery.dto;

import com.artgallery.model.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

/** Request body for POST /api/auth/register */
@Data
public class RegisterRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Role role = Role.CUSTOMER;
}
