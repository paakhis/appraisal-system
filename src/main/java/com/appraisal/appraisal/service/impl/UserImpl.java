package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.mapper.UserMapper;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserImpl implements UserService {

    private final UserRepository userRepository;

    public UserImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse createUser(UserRequest request) {

        String name = request.getName().trim();
        String email = request.getEmail().trim();

        if (name.isBlank()) {
            throw new RuntimeException("Name cannot be blank");
        }

        if (email.isBlank()) {
            throw new RuntimeException("Email cannot be blank");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = UserMapper.toEntity(request);
        user.setName(name);
        user.setEmail(email);

        User savedUser = userRepository.save(user);

        return UserMapper.toResponse(savedUser);
    }


    @Override
    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        String newName = request.getName().trim();
        String newEmail = request.getEmail().trim();

        if (newName.isBlank()) {
            throw new RuntimeException("Name cannot be blank");
        }

        if (newEmail.isBlank()) {
            throw new RuntimeException("Email cannot be blank");
        }

        if (!user.getEmail().equalsIgnoreCase(newEmail)
                && userRepository.existsByEmailIgnoreCase(newEmail)) {

            throw new RuntimeException("Email already exists");
        }

        user.setName(newName);
        user.setEmail(newEmail);
        user.setPassword(request.getPassword());

        User updatedUser = userRepository.save(user);

        return UserMapper.toResponse(updatedUser);
    }

    @Override
    public String deleteUserById(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User Not Found");
        }

        userRepository.deleteById(id);
        return "User Deleted Successfully";
    }
}