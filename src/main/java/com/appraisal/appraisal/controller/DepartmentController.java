package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.service.DepartmentService;
import com.appraisal.appraisal.dtos.DepartmentRequest;
import com.appraisal.appraisal.dtos.DepartmentResponse;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RequestMapping("/api/departments")
@RestController

public class DepartmentController {
    private final DepartmentService departmentService;
     public DepartmentController(DepartmentService departmentService){
         this.departmentService = departmentService;
     }

     @PostMapping
    public DepartmentResponse createDepartment(@RequestBody DepartmentRequest request){
         return departmentService.createDepartment(request);
     }

     @GetMapping
    public List<DepartmentResponse> getAllDepartment(){
         return departmentService.getAllDepartment();
     }

     @GetMapping("/{id}")
    public DepartmentResponse getDepartmentById(@PathVariable Long id){
         return departmentService.getDepartmentById(id);
     }

     @PutMapping("/{id}")
    public DepartmentResponse updateDepartment(@PathVariable Long id, @RequestBody DepartmentRequest request){
         return departmentService.updateDepartment(id, request);
     }

     @DeleteMapping("/{id}")
    public String deleteDepartmentById(@PathVariable Long id){
         departmentService.deleteDepartmentById(id);
         return "Department deleted successfully";

     }
}


