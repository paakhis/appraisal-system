package com.appraisal.appraisal.service;

import java.util.List;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;

public interface AppraisalService {
    AppraisalResponse createAppraisal(AppraisalRequest request);

    List<AppraisalResponse> getAllAppraisals();

    AppraisalResponse getAppraisalById(Long id);

    AppraisalResponse updateStatus(Long id, AppraisalStatus status);

    AppraisalResponse updateSelfRating(Long id, Double selfRating);

    void deleteAppraisal(Long id);
}
