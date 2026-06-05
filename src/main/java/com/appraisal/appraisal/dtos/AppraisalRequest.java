package com.appraisal.appraisal.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppraisalRequest {

    private Long employeeId;
    private Long cycleId;
}
