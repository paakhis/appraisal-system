package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.GoalRequest;
import com.appraisal.appraisal.dtos.GoalResponse;
import com.appraisal.appraisal.dtos.NotificationRequest;
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
import com.appraisal.appraisal.service.NotificationService;
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
    private final NotificationService notificationService;

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
        goal.setStatus(GoalStatus.DRAFT);

        Goal savedGoal = goalRepository.save(goal);

        notifyGoalCreated(savedGoal, user);

        return goalMapper.toResponse(savedGoal);
    }

    private void notifyGoalCreated(Goal goal, User user) {
        notificationService.sendNotification(new NotificationRequest(
                user.getId(),
                "Goal Created",
                "Your goal '" + goal.getTitle() + "' has been created successfully.",
                "GOAL"
        ));

        if (user.getManager() != null) {
            notificationService.sendNotification(new NotificationRequest(
                    user.getManager().getId(),
                    "New Goal Submitted",
                    user.getName() + " has created a new goal: '" + goal.getTitle() + "'.",
                    "GOAL"
            ));
        }
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
    public GoalResponse submitGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() != GoalStatus.DRAFT && goal.getStatus() != GoalStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT or SUBMITTED goals can be submitted");
        }

        goal.setStatus(GoalStatus.SUBMITTED);
        goalRepository.save(goal);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse acknowledgeGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() != GoalStatus.SUBMITTED) {
            throw new BadRequestException("Only ASSIGNED goals can be acknowledged");
        }

        goal.setStatus(GoalStatus.ACKNOWLEDGED);
        goalRepository.save(goal);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse completeGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() != GoalStatus.ACKNOWLEDGED) {
            throw new BadRequestException("Only ACKNOWLEDGED goals can be completed");
        }

        goal.setStatus(GoalStatus.COMPLETED);
        goalRepository.save(goal);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse approveGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() != GoalStatus.COMPLETED) {
            throw new BadRequestException("Only COMPLETED goals can be approved");
        }

        goal.setStatus(GoalStatus.APPROVED);
        goalRepository.save(goal);
        return goalMapper.toResponse(goal);
    }

    @Override
    @Transactional
    public GoalResponse rejectGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (goal.getStatus() != GoalStatus.COMPLETED) {
            throw new BadRequestException("Only COMPLETED goals can be rejected");
        }

        goal.setStatus(GoalStatus.REJECTED);
        goalRepository.save(goal);
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
                existingGoal.setStatus(normalizeGoalStatus(request.getStatus()));
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

    private GoalStatus normalizeGoalStatus(String status) {
        if (status == null || status.trim().isBlank()) {
            return GoalStatus.DRAFT;
        }

        String normalized = status.trim().toUpperCase();
        if ("SUBMITTED".equals(normalized)) {
            return GoalStatus.SUBMITTED;
        }

        return GoalStatus.valueOf(normalized);
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