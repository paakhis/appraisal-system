package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.AppraisalCycleRequest;
import com.appraisal.appraisal.dtos.AppraisalCycleResponse;
import com.appraisal.appraisal.service.AppraisalCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/appraisal-cycles")
public class AppraisalCycleController {

    private final AppraisalCycleService service;

    @PostMapping
    public ResponseEntity<AppraisalCycleResponse> create(@Valid @RequestBody AppraisalCycleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createCycle(request));
    }

    @GetMapping
    public ResponseEntity<List<AppraisalCycleResponse>> getAll() {
        return ResponseEntity.ok(service.getAllCycles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppraisalCycleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCycleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppraisalCycleResponse> update(@PathVariable Long id, @Valid @RequestBody AppraisalCycleRequest request) {
        return ResponseEntity.ok(service.updateCycle(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteCycle(id);
        return ResponseEntity.ok("Cycle deleted successfully");
}}
