package com.appraisal.appraisal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.service.AppraisalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appraisals")
@RequiredArgsConstructor
public class AppraisalController {

    private final AppraisalService appraisalService;

    @PostMapping
    public ResponseEntity<AppraisalResponse> createAppraisal(@Valid @RequestBody AppraisalRequest request) {
        return new ResponseEntity<>(appraisalService.createAppraisal(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AppraisalResponse>> getAllAppraisals() {
        return ResponseEntity.ok(appraisalService.getAllAppraisals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppraisalResponse> getAppraisalById(@PathVariable Long id) {
        return ResponseEntity.ok(appraisalService.getAppraisalById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppraisal(@PathVariable Long id) {
        appraisalService.deleteAppraisal(id);
        return ResponseEntity.ok("Appraisal deleted successfully");
    }

    @PatchMapping("/{id}/self-rating")
    public ResponseEntity<AppraisalResponse> updateSelfRating(
            @PathVariable Long id,
            @RequestParam(required = false) Double selfRating) {

        if (selfRating == null) {
            throw new BadRequestException("Self rating query parameter value is required");
        }

        return ResponseEntity.ok(appraisalService.updateSelfRating(id, selfRating));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppraisalResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (status == null || status.trim().isBlank()) {
            throw new BadRequestException("Status query parameter value string is required");
        }

        AppraisalStatus targetStatus;
        try {
            targetStatus = AppraisalStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid operational appraisal status value provided: '" + status + "'");
        }

        return ResponseEntity.ok(appraisalService.updateStatus(id, targetStatus));
    }}
