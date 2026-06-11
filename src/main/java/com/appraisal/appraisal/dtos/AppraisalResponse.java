package com.appraisal.appraisal.dtos;

import lombok.*;
import java.time.LocalDateTime;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class  AppraisalResponse {

    private Long id;

    private Long employeeId;
    private String employeeName;

    private Long managerId;
    private String managerName;

    private Long cycleId;
    private String cycleName;

    private Double selfRating;
    private Double managerRating;
    private String finalComment;

    private AppraisalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}