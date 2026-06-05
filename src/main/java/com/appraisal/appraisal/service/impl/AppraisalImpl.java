package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.*;
import com.appraisal.appraisal.entity.Appraisal;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.AppraisalMapper;
import com.appraisal.appraisal.repository.AppraisalRepository;
import com.appraisal.appraisal.service.AppraisalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppraisalImpl implements AppraisalService {

    private final AppraisalRepository appraisalRepository;

    @Override
    public AppraisalResponse createAppraisal(AppraisalRequest request) {
        Appraisal appraisal = AppraisalMapper.toEntity(request);
        Appraisal saved = appraisalRepository.save(appraisal);
        return AppraisalMapper.toResponse(saved);
    }

    @Override
    public List<AppraisalResponse> getAllAppraisals() {
        return appraisalRepository.findAll()
                .stream()
                .map(AppraisalMapper::toResponse)
                .toList();
    }

    @Override
    public AppraisalResponse getAppraisalById(Long id) {
        Appraisal appraisal = appraisalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal not found"));

        return AppraisalMapper.toResponse(appraisal);
    }
}
