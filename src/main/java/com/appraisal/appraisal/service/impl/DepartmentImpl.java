package com.appraisal.appraisal.service.impl;
import com.appraisal.appraisal.dtos.DepartmentResponse;
import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.mapper.DepartmentMapper;
import com.appraisal.appraisal.repository.DepartmentRepository;
import com.appraisal.appraisal.service.DepartmentService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
@Service
public class DepartmentImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        String name = request.getName().trim();
        if (name.isBlank()) {throw new RuntimeException("Department name cannot be blank");}
        if (departmentRepository.existsByNameIgnoreCase(name)) {throw new RuntimeException("Department already exists");}
        Department department = DepartmentMapper.toEntity(request);
        department.setName(name);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.toResponse(savedDepartment);}

//    @Override
//    public List<DepartmentResponse> getAllDepartment() {
//        return List.of();
//    }

    @Override
    public List<DepartmentResponse> getAllDepartment(){
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(DepartmentMapper::toResponse)
                .toList();}

    @Override
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department Not Found"));
        return DepartmentMapper.toResponse(department);}

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department Not Found"));
        String newName = request.getName().trim();
        if (newName.isBlank()) {throw new RuntimeException("Department name cannot be blank");}

        if (!department.getName().equalsIgnoreCase(newName) && departmentRepository.existsByNameIgnoreCase(newName)) {
            throw new RuntimeException("Department with this name already exists");}
        department.setName(newName);
        department.setDescription(request.getDescription());

        Department updatedDepartment = departmentRepository.save(department);
        return DepartmentMapper.toResponse(updatedDepartment);}

    @Override
    public void deleteDepartmentById(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department Not Found");}
        departmentRepository.deleteById(id);}


}
