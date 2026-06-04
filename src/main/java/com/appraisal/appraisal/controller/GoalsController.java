package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.GoalsRequest;
import com.appraisal.appraisal.dtos.GoalsResponse;
import com.appraisal.appraisal.service.GoalsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalsController {

    private final GoalsService goalsService;

    public GoalsController(
            GoalsService goalsService) {

        this.goalsService = goalsService;
    }

    @PostMapping
    public GoalsResponse createGoal(
            @Valid
            @RequestBody
            GoalsRequest request) {

        return goalsService.createGoal(
                request);
    }

    @GetMapping
    public List<GoalsResponse>
    getAllGoals() {

        return goalsService.getAllGoals();
    }

    @GetMapping("/{id}")
    public GoalsResponse getGoalById(
            @PathVariable Long id) {

        return goalsService.getGoalById(id);
    }

    @PutMapping("/{id}")
    public GoalsResponse updateGoal(
            @PathVariable Long id,
            @Valid
            @RequestBody
            GoalsRequest request) {

        return goalsService.updateGoal(
                id,
                request);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(
            @PathVariable Long id) {

        goalsService.deleteGoal(id);
    }
}