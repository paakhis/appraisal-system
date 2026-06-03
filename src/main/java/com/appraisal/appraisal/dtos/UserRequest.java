package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.entity.enums.Roles;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id;
    private String name;
    private String email;
    private String password;
}
