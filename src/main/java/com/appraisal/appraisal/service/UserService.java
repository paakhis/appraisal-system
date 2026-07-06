package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.BulkUserUploadResult;
import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import java.util.*;

public interface UserService {
    UserResponse createUser(UserRequest request);
    BulkUserUploadResult createUsersBulk(List<UserRequest> requests);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
