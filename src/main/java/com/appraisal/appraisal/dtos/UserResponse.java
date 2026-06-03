package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.entity.enums.Roles;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Roles roles;
    private Department department;
    private String designation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
