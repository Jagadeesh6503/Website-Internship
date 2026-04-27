package com.artgallery.dto;

import com.artgallery.model.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/** Public profile information returned to the logged-in user */
@Data @Builder
public class UserProfileResponse {
    private Long   id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String bio;
    private String avatarUrl;
    private Role   role;
    private boolean active;
    private LocalDateTime createdAt;
}
