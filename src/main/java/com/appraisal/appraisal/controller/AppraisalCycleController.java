package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.service.AppraisalCycleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appraisal-cycles")
public class AppraisalCycleController {

    private final AppraisalCycleService
            appraisalCycleService;

    public AppraisalCycleController(
            AppraisalCycleService appraisalCycleService) {

        this.appraisalCycleService =
                appraisalCycleService;
    }

    @PostMapping
    public AppraisalCycleResponse
    createCycle(
            @Valid
            @RequestBody
            AppraisalCycleRequest request) {

        return appraisalCycleService
                .createCycle(request);
    }

    @GetMapping
    public List<AppraisalCycleResponse>
    getAllCycles() {

        return appraisalCycleService
                .getAllCycles();
    }

    @GetMapping("/{id}")
    public AppraisalCycleResponse
    getCycleById(
            @PathVariable Long id) {

        return appraisalCycleService
                .getCycleById(id);
    }

    @PutMapping("/{id}")
    public AppraisalCycleResponse
    updateCycle(
            @PathVariable Long id,
            @Valid
            @RequestBody
            AppraisalCycleRequest request) {

        return appraisalCycleService
                .updateCycle(
                        id,
                        request);
    }

    @DeleteMapping("/{id}")
    public void deleteCycle(
            @PathVariable Long id) {

        appraisalCycleService
                .deleteCycle(id);
    }
}
