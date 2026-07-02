package com.appraisal.appraisal.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.Appraisal;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.DuplicateResourceException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.AppraisalMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.AppraisalRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.AppraisalService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppraisalImpl implements AppraisalService {

    private final AppraisalRepository appraisalRepository;
    private final UserRepository userRepository;
    private final AppraisalCycleRepository cycleRepository;

    @Override
    @Transactional
    public AppraisalResponse createAppraisal(AppraisalRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        // 1. Guard Rail: Prevent duplicate appraisals within the same cycle
        if (appraisalRepository.existsByEmployeeIdAndCycleId(request.getEmployeeId(), request.getCycleId())) {
            throw new DuplicateResourceException("An active appraisal record already exists for this employee in this cycle");
        }

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getEmployeeId()));

        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + request.getManagerId()));

        AppraisalCycle cycle = cycleRepository.findById(request.getCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal Cycle not found with ID: " + request.getCycleId()));

        // 2. Guard Rail: Ensure appraisals can only be opened during active cycles
        if (cycle.getActive() != null && !cycle.getActive()) {
            throw new BadRequestException("Cannot create appraisal logs under an inactive or closed appraisal cycle");
        }

        Appraisal appraisal = new Appraisal();
        appraisal.setEmployee(employee);
        appraisal.setManager(manager);
        appraisal.setCycle(cycle);
        appraisal.setStatus(AppraisalStatus.DRAFT); // Explicitly ensure standard start status

        Appraisal saved = appraisalRepository.save(appraisal);
        return AppraisalMapper.toResponse(saved);
    }

    @Override
    public List<AppraisalResponse> getAllAppraisals() {
        return appraisalRepository.findAllWithRelationships()
                .stream()
                .map(AppraisalMapper::toResponse)
                .toList();
    }

    @Override
    public AppraisalResponse getAppraisalById(Long id) {
        Appraisal appraisal = appraisalRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal file records not found with ID: " + id));
        return AppraisalMapper.toResponse(appraisal);
    }

    @Override
    @Transactional
    public AppraisalResponse updateSelfRating(Long id, Double selfRating) {
        if (selfRating == null) {
            throw new BadRequestException("Self rating value is required");
        }

        if (selfRating < 1 || selfRating > 5) {
            throw new BadRequestException("Self rating must be between 1 and 5");
        }

        Appraisal appraisal = appraisalRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal records not found with ID: " + id));

        appraisal.setSelfRating(selfRating);
        Appraisal updated = appraisalRepository.save(appraisal);
        return AppraisalMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAppraisal(Long id) {
        Appraisal appraisal = appraisalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal file records not found with ID: " + id));

        // Safety: Do not allow deletion of fully finalized data logs
        if (appraisal.getStatus() == AppraisalStatus.APPROVED) {
            throw new BadRequestException("Archived and APPROVED appraisals cannot be deleted from the corporate database system");
        }

        appraisalRepository.delete(appraisal);
    }

    @Override
    @Transactional
    public AppraisalResponse updateStatus(Long id, AppraisalStatus newStatus) {
        Appraisal appraisal = appraisalRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal records not found with ID: " + id));

        // Activated our workflow validation rules engine
        validateStatusTransition(appraisal.getStatus(), newStatus);

        appraisal.setStatus(newStatus);
        Appraisal updated = appraisalRepository.save(appraisal);
        return AppraisalMapper.toResponse(updated);
    }

    private void validateStatusTransition(AppraisalStatus currentStatus, AppraisalStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw new BadRequestException("Appraisal processing state status values cannot be null");
        }

        if (currentStatus == newStatus) {
            return; // Allow saving the current status state without error
        }

        if (currentStatus == AppraisalStatus.DRAFT && newStatus != AppraisalStatus.SUBMITTED) {
            throw new BadRequestException("Invalid Action Sequence: Draft evaluation cards can only advance to SUBMITTED state status");
        }

        if (currentStatus == AppraisalStatus.SUBMITTED && newStatus != AppraisalStatus.REVIEWED) {
            throw new BadRequestException("Invalid Action Sequence: Submitted logs must transition to REVIEWED after evaluation");
        }

        if (currentStatus == AppraisalStatus.REVIEWED && newStatus != AppraisalStatus.APPROVED) {
            throw new BadRequestException("Invalid Action Sequence: Reviewed status cards can only transition to a closed APPROVED state");
        }

        if (currentStatus == AppraisalStatus.APPROVED) {
            throw new BadRequestException("Workflow Locked: This file tracking record has achieved APPROVED closure status and cannot be modified");
        }
    }
}