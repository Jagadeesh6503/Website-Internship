package com.artgallery.dto;

import com.artgallery.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

/** Authentication response containing JWT token and user info */
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long   id;
    private String firstName;
    private String lastName;
    private String email;
    private Role   role;
}
