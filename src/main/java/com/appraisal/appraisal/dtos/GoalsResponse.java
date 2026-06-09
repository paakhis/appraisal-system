package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.enums.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalsResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDate targetDate;

    private GoalStatus status;

    private String employeeName;

    private String appraisalCycleName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    //due date, note, email
}