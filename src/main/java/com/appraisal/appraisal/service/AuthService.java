package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.LoginRequest;
import com.appraisal.appraisal.dtos.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
