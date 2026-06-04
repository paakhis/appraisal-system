package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.DuplicateResourceException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.AppraisalCycleMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.service.AppraisalCycleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppraisalCycleImpl
        implements AppraisalCycleService {

    private final AppraisalCycleRepository
            appraisalCycleRepository;

    private final AppraisalCycleMapper
            appraisalCycleMapper;

    public AppraisalCycleImpl(
            AppraisalCycleRepository appraisalCycleRepository,
            AppraisalCycleMapper appraisalCycleMapper) {

        this.appraisalCycleRepository =
                appraisalCycleRepository;

        this.appraisalCycleMapper =
                appraisalCycleMapper;
    }

    @Override
    public AppraisalCycleResponse createCycle(
            AppraisalCycleRequest request) {

        String cycleName =
                request.getName().trim();

        if (appraisalCycleRepository
                .existsByNameIgnoreCase(
                        cycleName)) {

            throw new DuplicateResourceException(
                    "Appraisal Cycle already exists");
        }

        if (request.getStartDate()
                .isAfter(request.getEndDate())) {

            throw new BadRequestException(
                    "Start date cannot be after end date");
        }

        AppraisalCycle cycle =
                new AppraisalCycle();

        cycle.setName(cycleName);

        cycle.setStartDate(
                request.getStartDate());

        cycle.setEndDate(
                request.getEndDate());

        cycle.setActive(true);

        AppraisalCycle savedCycle =
                appraisalCycleRepository.save(
                        cycle);

        return appraisalCycleMapper
                .toResponse(savedCycle);
    }

    @Override
    public List<AppraisalCycleResponse>
    getAllCycles() {

        return appraisalCycleRepository
                .findAll()
                .stream()
                .map(
                        appraisalCycleMapper::toResponse
                )
                .toList();
    }

    @Override
    public AppraisalCycleResponse
    getCycleById(Long id) {

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        return appraisalCycleMapper
                .toResponse(cycle);
    }

    @Override
    public AppraisalCycleResponse
    updateCycle(
            Long id,
            AppraisalCycleRequest request) {

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        String newName =
                request.getName().trim();

        if (!cycle.getName()
                .equalsIgnoreCase(newName)
                &&
                appraisalCycleRepository
                        .existsByNameIgnoreCase(
                                newName)) {

            throw new DuplicateResourceException(
                    "Appraisal Cycle already exists");
        }

        if (request.getStartDate()
                .isAfter(request.getEndDate())) {

            throw new BadRequestException(
                    "Start date cannot be after end date");
        }

        cycle.setName(newName);

        cycle.setStartDate(
                request.getStartDate());

        cycle.setEndDate(
                request.getEndDate());

        AppraisalCycle updatedCycle =
                appraisalCycleRepository
                        .save(cycle);

        return appraisalCycleMapper
                .toResponse(updatedCycle);
    }

    @Override
    public void deleteCycle(Long id) {

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        appraisalCycleRepository
                .delete(cycle);
    }
}
