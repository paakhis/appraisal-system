package com.appraisal.appraisal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appraisal.appraisal.dtos.GoalRequest;
import com.appraisal.appraisal.dtos.GoalResponse;
import com.appraisal.appraisal.service.GoalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody GoalRequest request) {
        return new ResponseEntity<>(goalService.createGoal(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAll() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoalById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(id, request));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<GoalResponse> submitGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.submitGoal(id));
    }

    @PatchMapping("/{id}/acknowledge")
    public ResponseEntity<GoalResponse> acknowledgeGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.acknowledgeGoal(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<GoalResponse> completeGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.completeGoal(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<GoalResponse> approveGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.approveGoal(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<GoalResponse> rejectGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.rejectGoal(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok("Goal deleted successfully");
    }
}