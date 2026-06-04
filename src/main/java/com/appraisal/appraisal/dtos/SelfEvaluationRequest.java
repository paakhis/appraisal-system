package com.appraisal.appraisal.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelfEvaluationRequest {

    @NotBlank
    private String achievements;

    private String challenges;

    private String comments;

    @NotNull
    private Long userId;

    @NotNull
    private Long appraisalCycleId;
}
