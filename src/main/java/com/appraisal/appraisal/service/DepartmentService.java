package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.dtos.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse createDepartment(DepartmentRequest request);
    List<DepartmentResponse> getAllDepartment();
    DepartmentResponse getDepartmentById(Long id);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    String deleteDepartmentById(Long id);
}
