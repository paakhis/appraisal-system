package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import org.springframework.stereotype.Component;

@Component
public class AppraisalCycleMapper {

    public AppraisalCycleResponse toResponse(
            AppraisalCycle cycle) {

        return new AppraisalCycleResponse(
                cycle.getId(),
                cycle.getName(),
                cycle.getStartDate(),
                cycle.getEndDate(),
                cycle.getActive(),
                cycle.getCreatedAt(),
                cycle.getUpdatedAt()
        );
    }
}
