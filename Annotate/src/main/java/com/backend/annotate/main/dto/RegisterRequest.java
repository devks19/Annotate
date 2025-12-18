package com.backend.annotate.main.dto;

import com.backend.annotate.main.enums.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private UserRole role;
    private Long teamId;
}


