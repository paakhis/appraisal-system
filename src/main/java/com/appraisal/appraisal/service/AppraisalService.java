package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;

import java.util.List;

public interface AppraisalService {

    AppraisalResponse createAppraisal(AppraisalRequest request);

    List<AppraisalResponse> getAllAppraisals();

    AppraisalResponse getAppraisalById(Long id);
}
