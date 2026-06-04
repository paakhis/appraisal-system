package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.GoalsRequest;
import com.appraisal.appraisal.dtos.GoalsResponse;

import java.util.List;

public interface GoalsService {

    GoalsResponse createGoal(
            GoalsRequest request);

    List<GoalsResponse> getAllGoals();

    GoalsResponse getGoalById(
            Long id);

    GoalsResponse updateGoal(
            Long id,
            GoalsRequest request);

    void deleteGoal(Long id);
}