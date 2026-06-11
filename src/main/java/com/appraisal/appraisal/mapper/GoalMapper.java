package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.GoalResponse;
import com.appraisal.appraisal.entity.Goal;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public GoalResponse toResponse(Goal goal) {
        if (goal == null) {
            return null;
        }

        GoalResponse response = new GoalResponse();
        response.setId(goal.getId());
        response.setTitle(goal.getTitle());
        response.setDescription(goal.getDescription());
        response.setTargetDate(goal.getTargetDate());
        response.setStatus(goal.getStatus());
        response.setCreatedAt(goal.getCreatedAt());
        response.setUpdatedAt(goal.getUpdatedAt());

        if (goal.getUser() != null) {
            response.setUserId(goal.getUser().getId());
            response.setEmployeeName(goal.getUser().getName());
        }

        if (goal.getAppraisalCycle() != null) {
            response.setAppraisalCycleId(goal.getAppraisalCycle().getId());
            response.setCycleName(goal.getAppraisalCycle().getName());
        }

        return response;
    }
}