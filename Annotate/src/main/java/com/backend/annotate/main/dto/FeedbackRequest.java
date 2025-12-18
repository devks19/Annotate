package com.backend.annotate.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    private Long videoId;
    private String comment;
    private Integer timestampSeconds;
}
