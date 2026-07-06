package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusBreakdownEntry {
    private AppraisalStatus status;
    private long count;
}
