package com.artgallery.dto;

import lombok.Data;

/** DTO for updating a user's own profile */
@Data
public class UserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
}
