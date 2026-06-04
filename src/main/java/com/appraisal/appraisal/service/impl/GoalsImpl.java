package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.GoalsRequest;
import com.appraisal.appraisal.dtos.GoalsResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.Goals;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.GoalsMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.GoalsRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.GoalsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GoalsImpl
        implements GoalsService {

    private final GoalsRepository goalsRepository;

    private final UserRepository userRepository;

    private final AppraisalCycleRepository
            appraisalCycleRepository;

    private final GoalsMapper goalsMapper;

    public GoalsImpl(
            GoalsRepository goalsRepository,
            UserRepository userRepository,
            AppraisalCycleRepository appraisalCycleRepository,
            GoalsMapper goalsMapper) {

        this.goalsRepository = goalsRepository;
        this.userRepository = userRepository;
        this.appraisalCycleRepository =
                appraisalCycleRepository;
        this.goalsMapper = goalsMapper;
    }

    @Override
    public GoalsResponse createGoal(
            GoalsRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(
                                request.getAppraisalCycleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        if(request.getTargetDate()
                .isBefore(LocalDate.now())) {

            throw new BadRequestException(
                    "Target date cannot be in the past");
        }

        Goals goal = new Goals();

        goal.setTitle(
                request.getTitle());

        goal.setDescription(
                request.getDescription());

        goal.setTargetDate(
                request.getTargetDate());

        goal.setUser(user);

        goal.setAppraisalCycle(cycle);

        Goals savedGoal =
                goalsRepository.save(goal);

        return goalsMapper.toResponse(
                savedGoal);
    }

    @Override
    public List<GoalsResponse>
    getAllGoals() {

        return goalsRepository.findAll()
                .stream()
                .map(goalsMapper::toResponse)
                .toList();
    }

    @Override
    public GoalsResponse getGoalById(
            Long id) {

        Goals goal = goalsRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Goal not found"));

        return goalsMapper.toResponse(goal);
    }

    @Override
    public GoalsResponse updateGoal(
            Long id,
            GoalsRequest request) {

        Goals goal = goalsRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Goal not found"));

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(
                                request.getAppraisalCycleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        goal.setTitle(
                request.getTitle());

        goal.setDescription(
                request.getDescription());

        goal.setTargetDate(
                request.getTargetDate());

        goal.setUser(user);

        goal.setAppraisalCycle(cycle);

        Goals updatedGoal =
                goalsRepository.save(goal);

        return goalsMapper.toResponse(
                updatedGoal);
    }

    @Override
    public void deleteGoal(
            Long id) {

        Goals goal = goalsRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Goal not found"));

        goalsRepository.delete(goal);
    }
}