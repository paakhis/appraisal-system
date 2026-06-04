package com.appraisal.appraisal.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelfEvaluationResponse {
    private Long id;
    private String achievements;
    private String challenges;
    private String comments;
    private String employeeName;
    private String cycleName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
