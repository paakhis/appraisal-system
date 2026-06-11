package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.dtos.DepartmentResponse;
import com.appraisal.appraisal.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {
        if (request == null) {
            return null;
        }
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return department;
    }

    public DepartmentResponse toResponse(Department department) {
        if (department == null) {
            return null;
        }
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getCreatedAt(),
                department.getUpdatedAt()
        );
    }
}