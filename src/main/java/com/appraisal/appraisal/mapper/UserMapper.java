package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import com.appraisal.appraisal.entity.User;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;

public class UserMapper {
    public static User toEntity(UserRequest request){
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return user;
    }

    public static UserResponse toResponse(User user){
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles(),
                user.getDepartment(),
                user.getDesignation(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
