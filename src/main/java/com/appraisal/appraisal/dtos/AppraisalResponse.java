package com.appraisal.appraisal.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppraisalResponse {

    private Long id;
    private Long employeeId;
    private Long cycleId;

    private Double selfRating;
    private Double managerRating;

    private String finalComment;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}