package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;

import java.util.List;

public interface AppraisalCycleService {

    AppraisalCycleResponse createCycle(
            AppraisalCycleRequest request);

    List<AppraisalCycleResponse> getAllCycles();

    AppraisalCycleResponse getCycleById(
            Long id);

    AppraisalCycleResponse updateCycle(
            Long id,
            AppraisalCycleRequest request);

    void deleteCycle(Long id);
}
