package com.appraisal.appraisal.service;

import java.util.List;

import com.appraisal.appraisal.dtos.GoalRequest;
import com.appraisal.appraisal.dtos.GoalResponse;

public interface GoalService {

    GoalResponse createGoal(
            GoalRequest request);

    List<GoalResponse> getAllGoals();

    GoalResponse getGoalById(
            Long id);

    GoalResponse updateGoal(
            Long id,
            GoalRequest request);
    GoalResponse submitGoal(Long id);

    GoalResponse acknowledgeGoal(Long id);

    GoalResponse completeGoal(Long id);

    GoalResponse approveGoal(Long id);

    GoalResponse rejectGoal(Long id);

    void deleteGoal(Long id);
}