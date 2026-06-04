package com.appraisal.appraisal.dtos;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppraisalCycleResponse {

    private Long id;

    private String name;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
