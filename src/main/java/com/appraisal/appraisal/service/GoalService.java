package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.GoalRequest;
import com.appraisal.appraisal.dtos.GoalResponse;

import java.util.List;

public interface GoalService {

    GoalResponse createGoal(
            GoalRequest request);

    List<GoalResponse> getAllGoals();

    GoalResponse getGoalById(
            Long id);

    GoalResponse updateGoal(
            Long id,
            GoalRequest request);

    void deleteGoal(Long id);
}