package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.service.AppraisalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appraisals")
@RequiredArgsConstructor
public class AppraisalController {

    private final AppraisalService appraisalService;

    @PostMapping
    public AppraisalResponse create(@RequestBody AppraisalRequest request) {
        return appraisalService.createAppraisal(request);
    }

    @GetMapping
    public List<AppraisalResponse> getAll() {
        return appraisalService.getAllAppraisals();
    }

    @GetMapping("/{id}")
    public AppraisalResponse getById(@PathVariable Long id) {
        return appraisalService.getAppraisalById(id);
    }
}
