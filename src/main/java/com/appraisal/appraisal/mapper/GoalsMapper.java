package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.GoalsResponse;
import com.appraisal.appraisal.entity.Goals;
import org.springframework.stereotype.Component;

@Component
public class GoalsMapper {

    public GoalsResponse toResponse(
            Goals goals) {

        return new GoalsResponse(
                goals.getId(),
                goals.getTitle(),
                goals.getDescription(),
                goals.getTargetDate(),
                goals.getStatus(),
                goals.getUser().getName(),
                goals.getAppraisalCycle().getName(),
                goals.getCreatedAt(),
                goals.getUpdatedAt()
        );
    }
}