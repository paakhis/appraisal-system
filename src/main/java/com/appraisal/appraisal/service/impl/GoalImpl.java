package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.GoalRequest;
import com.appraisal.appraisal.dtos.GoalResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.Goal;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.entity.enums.GoalStatus;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.GoalMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.GoalRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.GoalService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final AppraisalCycleRepository appraisalCycleRepository;
    private final GoalMapper goalMapper;

    @Override
    @Transactional
    public GoalResponse createGoal(GoalRequest request) {
        if (request == null) {
            throw new BadRequestException("Goal request payload body cannot be null");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        AppraisalCycle cycle = appraisalCycleRepository.findById(request.getAppraisalCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal Cycle record not found with ID: " + request.getAppraisalCycleId()));

        // Perform strict chronological lifecycle validation
        validateGoalTimeline(request.getTargetDate(), cycle);

        Goal goal = new Goal();
        goal.setTitle(request.getTitle().trim());
        goal.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        goal.setTargetDate(request.getTargetDate());
        goal.setUser(user);
        goal.setAppraisalCycle(cycle);
        goal.setStatus(GoalStatus.NOT_STARTED);

        Goal savedGoal = goalRepository.save(goal);
        return goalMapper.toResponse(savedGoal);
    }

    @Override
    public List<GoalResponse> getAllGoals() {
        return goalRepository.findAllWithRelationships()
                .stream()
                .map(goalMapper::toResponse)
                .toList();
    }

    @Override
    public GoalResponse getGoalById(Long id) {
        Goal goal = goalRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal metric file not found with ID: " + id));
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse updateGoal(Long id, GoalRequest request) {
        if (request == null) {
            throw new BadRequestException("Goal update request payload body cannot be null");
        }

        Goal existingGoal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal metric file not found with ID: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        AppraisalCycle cycle = appraisalCycleRepository.findById(request.getAppraisalCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal Cycle record not found with ID: " + request.getAppraisalCycleId()));

        validateGoalTimeline(request.getTargetDate(), cycle);

        existingGoal.setTitle(request.getTitle().trim());
        existingGoal.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        existingGoal.setTargetDate(request.getTargetDate());
        existingGoal.setUser(user);
        existingGoal.setAppraisalCycle(cycle);

        // Update target status transitions dynamically if passed in payload parameter
        if (request.getStatus() != null && !request.getStatus().trim().isBlank()) {
            try {
                existingGoal.setStatus(GoalStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid standard corporate goal status tracking value provided: " + request.getStatus());
            }
        }

        Goal updatedGoal = goalRepository.save(existingGoal);
        return goalMapper.toResponse(updatedGoal);
    }

    @Override
    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal metric file not found with ID: " + id));
        goalRepository.delete(goal);
    }

    private void validateGoalTimeline(LocalDate targetDate, AppraisalCycle cycle) {
        if (targetDate == null) {
            throw new BadRequestException("Goal target evaluation date specification cannot be null");
        }
        if (targetDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Invalid Configuration: Target verification execution date cannot be backdated to occur in the past");
        }
        // Core Business Validation Rule Safeguard
        if (cycle.getEndDate() != null && targetDate.isAfter(cycle.getEndDate())) {
            throw new BadRequestException("Timeline Boundary Violation: The designated target execution date (" + targetDate
                    + ") must fall within the absolute boundaries of the tracking Appraisal Cycle window (" + cycle.getEndDate() + ")");
        }
    }
}