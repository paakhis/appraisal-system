package com.appraisal.appraisal.service.impl;
import com.appraisal.appraisal.dtos.DepartmentResponse;
import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.mapper.DepartmentMapper;
import com.appraisal.appraisal.repository.DepartmentRepository;
import com.appraisal.appraisal.service.DepartmentService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.appraisal.appraisal.exception.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (request == null || request.getName() == null) {
            throw new BadRequestException("Department name cannot be null");
        }

        String normalizedName = request.getName().trim();

        if (departmentRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Department with name '" + normalizedName + "' already exists");
        }

        Department department = departmentMapper.toEntity(request);
        department.setName(normalizedName);

        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponse(savedDepartment);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toResponse)
                .toList();
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return departmentMapper.toResponse(department);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        if (request == null || request.getName() == null) {
            throw new BadRequestException("Department name cannot be null");
        }

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        String normalizedName = request.getName().trim();

        if (!department.getName().equalsIgnoreCase(normalizedName) &&
                departmentRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Department with name '" + normalizedName + "' already exists");
        }

        department.setName(normalizedName);
        department.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Department updatedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponse(updatedDepartment);
    }

    @Override
    @Transactional
    public void deleteDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        if (department.getUsers() != null && !department.getUsers().isEmpty()) {
            throw new BadRequestException("Cannot delete department because it contains active users assigned to it");
        }

        departmentRepository.delete(department);
    }
}