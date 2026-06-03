package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.dtos.DepartmentResponse;
import com.appraisal.appraisal.entity.Department;

public class DepartmentMapper {
    public static Department toEntity(DepartmentRequest request){
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return department;
    }

    public static DepartmentResponse toResponse(Department department){
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getCreatedAt(),
                department.getUpdatedAt()
        );
    }
}
