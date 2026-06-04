package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.SelfEvaluationResponse;
import com.appraisal.appraisal.entity.SelfEvaluation;
import org.springframework.stereotype.Component;

@Component
public class SelfEvaluationMapper {

    public SelfEvaluationResponse toResponse(
            SelfEvaluation selfEvaluation) {

        return new SelfEvaluationResponse(
                selfEvaluation.getId(),
                selfEvaluation.getAchievements(),
                selfEvaluation.getChallenges(),
                selfEvaluation.getComments(),
                selfEvaluation.getUser().getName(),
                selfEvaluation.getAppraisalCycle().getName(),
                selfEvaluation.getCreatedAt(),
                selfEvaluation.getUpdatedAt()
        );
    }
}
