package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;

import java.util.List;

public interface AppraisalService {
    AppraisalResponse createAppraisal(AppraisalRequest request);

    List<AppraisalResponse> getAllAppraisals();

    AppraisalResponse getAppraisalById(Long id);

    AppraisalResponse updateStatus(Long id, AppraisalStatus status);

    void deleteAppraisal(Long id);
}
