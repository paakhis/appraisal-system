package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.*;
import com.appraisal.appraisal.mapper.UserMapper;
import com.appraisal.appraisal.repository.*;
import com.appraisal.appraisal.service.UserService;
import com.appraisal.appraisal.entity.enums.Roles;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        if (!hasText(request.getPassword())) {
            throw new BadRequestException("Password cannot be empty");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("User with email '" + normalizedEmail + "' already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + request.getManagerId()));
        }

        User user = new User();
        mapRequestToEntity(request, user, department, manager);
        user.setEmail(normalizedEmail);

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        // Uses the newly optimized FETCH JOIN query instead of standard findAll()
        return userRepository.findAllWithRelationships()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (!existingUser.getEmail().equalsIgnoreCase(normalizedEmail) &&
                userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("Email '" + normalizedEmail + "' is already claimed by another user");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        User manager = null;
        if (request.getManagerId() != null) {
            if (id.equals(request.getManagerId())) {
                throw new BadRequestException("A user cannot be assigned as their own manager");
            }
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + request.getManagerId()));
        }

        // Map updates directly onto our managed existing database object to safely protect audit history timestamps
        mapRequestToEntity(request, existingUser, department, manager);
        existingUser.setEmail(normalizedEmail);

        User saved = userRepository.save(existingUser);
        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Safeguard constraint: Prevent deleting a manager if employees report to them
        if (userRepository.existsByManagerId(id)) {
            throw new BadRequestException("Cannot delete this user because they are actively assigned as a manager to other employees");
        }

        userRepository.delete(user);
    }

    // A robust mapping utility method that catches Enum parsing failures gracefully
    private void mapRequestToEntity(UserRequest request, User user, Department department, User manager) {
        user.setName(request.getName().trim());
        if (hasText(request.getPassword())) {
            user.setPassword(request.getPassword().trim());
        }
        user.setDesignation(request.getDesignation().trim());
        user.setDepartment(department);
        user.setManager(manager);

        try {
            user.setRoles(Roles.valueOf(request.getRoles().trim().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new BadRequestException("Invalid system role type standard provided: " + request.getRoles());
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}