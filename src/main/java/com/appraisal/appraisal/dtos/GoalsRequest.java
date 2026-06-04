package com.appraisal.appraisal.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalsRequest {

    @NotBlank(message = "Goal title is required")
    private String title;

    private String description;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    @NotNull(message = "User Id is required")
    private Long userId;

    @NotNull(message = "Appraisal Cycle Id is required")
    private Long appraisalCycleId;
}