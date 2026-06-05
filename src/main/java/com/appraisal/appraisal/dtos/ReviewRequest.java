package com.appraisal.appraisal.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    private Long employeeId;
    private Long managerId;
    private Long cycleId;

    private Double performanceRating;
    private String comments;
    private String strengths;
    private String improvements;
}
