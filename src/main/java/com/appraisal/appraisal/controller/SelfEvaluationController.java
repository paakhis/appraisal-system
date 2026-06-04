package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.SelfEvaluationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationResponse;
import com.appraisal.appraisal.service.SelfEvaluationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/self-evaluations")
public class SelfEvaluationController {

    private final SelfEvaluationService
            selfEvaluationService;

    public SelfEvaluationController(
            SelfEvaluationService selfEvaluationService) {

        this.selfEvaluationService =
                selfEvaluationService;
    }

    @PostMapping
    public SelfEvaluationResponse
    createSelfEvaluation(
            @Valid
            @RequestBody
            SelfEvaluationRequest request) {

        return selfEvaluationService
                .createSelfEvaluation(request);
    }

    @GetMapping
    public List<SelfEvaluationResponse>
    getAllSelfEvaluations() {

        return selfEvaluationService
                .getAllSelfEvaluations();
    }

    @GetMapping("/{id}")
    public SelfEvaluationResponse
    getSelfEvaluationById(
            @PathVariable Long id) {

        return selfEvaluationService
                .getSelfEvaluationById(id);
    }

    @PutMapping("/{id}")
    public SelfEvaluationResponse
    updateSelfEvaluation(
            @PathVariable Long id,
            @Valid
            @RequestBody
            SelfEvaluationRequest request) {

        return selfEvaluationService
                .updateSelfEvaluation(
                        id,
                        request);
    }

    @DeleteMapping("/{id}")
    public void deleteSelfEvaluation(
            @PathVariable Long id) {

        selfEvaluationService
                .deleteSelfEvaluation(id);
    }
}
