package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.LoginRequest;
import com.appraisal.appraisal.dtos.LoginResponse;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword().trim())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles().name()
        );
    }
}