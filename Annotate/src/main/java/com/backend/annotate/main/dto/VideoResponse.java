package com.backend.annotate.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoResponse {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer durationSeconds;
    private Boolean isPublished;
    private UserResponse creator;
    private LocalDateTime createdAt;

    // Access code fields
    private String accessCode;
    private Boolean requiresAccessCode;
}
