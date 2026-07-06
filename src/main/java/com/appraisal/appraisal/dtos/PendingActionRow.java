package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingActionRow {
    private String employeeName;
    private String department;
    private String managerName;
    private AppraisalStatus status;
}
