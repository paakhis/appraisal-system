package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface AppraisalCycleService {
    AppraisalCycleResponse createCycle(AppraisalCycleRequest request);

    List<AppraisalCycleResponse> getAllCycles();

    AppraisalCycleResponse getCycleById(Long id);

    AppraisalCycleResponse updateCycle(Long id, AppraisalCycleRequest request);

    void deleteCycle(Long id);
    }

