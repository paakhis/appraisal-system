package com.appraisal.appraisal.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long employeeId;
    private Long managerId;
    private Long cycleId;

    private Double performanceRating;
    private String comments;
    private String strengths;
    private String improvements;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
