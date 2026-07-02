package com.appraisal.appraisal.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.DuplicateResourceException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.AppraisalCycleMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.AppraisalCycleService;
import com.appraisal.appraisal.service.NotificationService;
import com.appraisal.appraisal.entity.Appraisal;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import com.appraisal.appraisal.entity.enums.Roles;
import com.appraisal.appraisal.repository.AppraisalRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppraisalCycleImpl implements AppraisalCycleService {

    private final AppraisalCycleRepository repository;
    private final AppraisalCycleMapper mapper;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AppraisalRepository appraisalRepository;

    @Override
    @Transactional
    public AppraisalCycleResponse createCycle(AppraisalCycleRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        validateDates(request);

        String normalizedName = request.getName().trim();
        if (repository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Appraisal cycle with name '" + normalizedName + "' already exists");
        }

        // Business Rule Guard Rail: Enforce exactly one active cycle at a time across the enterprise
        if (request.getActive() != null && request.getActive()) {
            repository.deactivateAllActiveCycles();
        }

        AppraisalCycle cycle = mapper.toEntity(request);
        cycle.setName(normalizedName);

        AppraisalCycle savedCycle = repository.save(cycle);

// Automatically create appraisal records
createAppraisalsForEmployees(savedCycle);

notifyCycleCreated(savedCycle);

return mapper.toResponse(savedCycle);
    }

    private void notifyCycleCreated(AppraisalCycle cycle) {
        List<User> allUsers = userRepository.findAll();
        for (User recipient : allUsers) {
            notificationService.sendNotification(new NotificationRequest(
                    recipient.getId(),
                    "New Appraisal Cycle Created",
                    "A new appraisal cycle '" + cycle.getName() + "' has been created, running from "
                            + cycle.getStartDate() + " to " + cycle.getEndDate() + ".",
                    "APPRAISAL"
            ));
        }
    }

    @Override
    public List<AppraisalCycleResponse> getAllCycles() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public AppraisalCycleResponse getCycleById(Long id) {
        AppraisalCycle cycle = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal cycle not found with ID: " + id));
        return mapper.toResponse(cycle);
    }

    @Override
    @Transactional
    public AppraisalCycleResponse updateCycle(Long id, AppraisalCycleRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        validateDates(request);

        AppraisalCycle cycle = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal cycle not found with ID: " + id));

        String normalizedName = request.getName().trim();
        if (!cycle.getName().equalsIgnoreCase(normalizedName) && repository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Appraisal cycle with name '" + normalizedName + "' already exists");
        }

        // Manage active cycle overrides safely
        if (request.getActive() != null && request.getActive() && !cycle.getActive()) {
            repository.deactivateAllActiveCycles();
        }

        cycle.setName(normalizedName);
        cycle.setStartDate(request.getStartDate());
        cycle.setEndDate(request.getEndDate());
        cycle.setActive(request.getActive() != null ? request.getActive() : cycle.getActive());

        return mapper.toResponse(repository.save(cycle));
    }

    @Override
    @Transactional
    public void deleteCycle(Long id) {
        AppraisalCycle cycle = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal cycle not found with ID: " + id));

        // Safeguard: Stop cascading database errors if evaluations have already started within this timeline
        if (cycle.getAppraisals() != null && !cycle.getAppraisals().isEmpty()) {
            throw new BadRequestException("Cannot delete this appraisal cycle because it contains active employee evaluations logs");
        }

        repository.delete(cycle);
    }

    private void validateDates(AppraisalCycleRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Start date and end date must not be null");
        }
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BadRequestException("Invalid Timeline: The cycle End Date must strictly be configured to occur after its Start Date");
        }
    }

    private void createAppraisalsForEmployees(AppraisalCycle cycle) {

    List<User> employees = userRepository.findAll()
            .stream()
            .filter(user -> user.getRoles() == Roles.EMPLOYEE)
            .toList();

    for (User employee : employees) {

        // Employee must have a manager
        if (employee.getManager() == null) {
            continue;
        }

        // Skip if appraisal already exists
        if (appraisalRepository.existsByEmployeeIdAndCycleId(
                employee.getId(),
                cycle.getId())) {
            continue;
        }

        Appraisal appraisal = new Appraisal();

        appraisal.setEmployee(employee);
        appraisal.setManager(employee.getManager());
        appraisal.setCycle(cycle);
        appraisal.setStatus(AppraisalStatus.DRAFT);

        appraisalRepository.save(appraisal);
    }
}
}