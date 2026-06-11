package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.entity.enums.Roles;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    private String designation;

    private Long departmentId;
    private String departmentName;

    private Long managerId;
    private String managerName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
