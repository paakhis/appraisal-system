package com.appraisal.appraisal.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalRequest {

    @NotBlank(message = "Goal title is required and cannot be empty")
    @Size(min = 3, max = 150, message = "Goal title must be between 3 and 150 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Target execution date is required")
    private LocalDate targetDate;

    @NotNull(message = "Target employee User ID reference is required")
    private Long userId;

    @NotNull(message = "Appraisal Cycle ID tracker association link is required")
    private Long appraisalCycleId;

    private String status;
}