package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import java.util.*;

public interface UserService {
    UserResponse createUser(UserRequest request);
    List<UserResponse> getAllUser();
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserRequest request);
    String deleteUserById(Long id);


}
