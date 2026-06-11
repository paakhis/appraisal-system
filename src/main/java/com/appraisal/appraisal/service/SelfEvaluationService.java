package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.SelfEvaluationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationResponse;

import java.util.List;

public interface SelfEvaluationService {
    SelfEvaluationResponse createSelfEvaluation(SelfEvaluationRequest request);
    List<SelfEvaluationResponse> getAllSelfEvaluations();
    SelfEvaluationResponse getSelfEvaluationById(Long id);
    SelfEvaluationResponse updateSelfEvaluation(Long id, SelfEvaluationRequest request);
    void deleteSelfEvaluation(Long id);
}

