package com.appraisal.appraisal.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role cannot be empty")
    private String roles;

    @NotBlank(message = "Designation cannot be empty")
    private String designation;

    // REQUIRED
    private Long departmentId;

    // OPTIONAL (manager may not exist for top-level users)
    private Long managerId;
}
