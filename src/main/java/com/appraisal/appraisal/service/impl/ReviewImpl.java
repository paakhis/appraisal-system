package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.*;
import com.appraisal.appraisal.entity.*;
import com.appraisal.appraisal.entity.enums.ReviewStatus;
import com.appraisal.appraisal.exception.*;
import com.appraisal.appraisal.mapper.ReviewMapper;
import com.appraisal.appraisal.repository.AppraisalRepository;
import com.appraisal.appraisal.repository.ReviewRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.ReviewService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppraisalRepository appraisalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        if (request == null) {
            throw new BadRequestException("Request payload content body cannot be null");
        }

        // Rule Safeguard: Prevent duplicate evaluation records
        if (reviewRepository.existsByAppraisalIdAndManagerId(request.getAppraisalId(), request.getManagerId())) {
            throw new DuplicateResourceException("A performance review log already exists from this manager for this appraisal session");
        }

        Appraisal appraisal = appraisalRepository.findById(request.getAppraisalId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal session record not found with ID: " + request.getAppraisalId()));

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getEmployeeId()));

        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + request.getManagerId()));

        Review review = ReviewMapper.toEntity(request, appraisal, employee, manager);
        review.setStatus(ReviewStatus.DRAFT);

        Review saved = reviewRepository.save(review);
        return ReviewMapper.toResponse(saved);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllWithRelationships()
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review file record not found with ID: " + id));
        return ReviewMapper.toResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long id, ReviewRequest request) {
        if (request == null) {
            throw new BadRequestException("Update payload content body cannot be null");
        }

        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review record not found with ID: " + id));

        // Safeguard: Lock down updates if the review has already been finalized
        if (existingReview.getStatus() == ReviewStatus.SUBMITTED) {
            throw new BadRequestException("Workflow Locked: This evaluation has been finalized and submitted and cannot be modified");
        }

        existingReview.setPerformanceRating(request.getPerformanceRating());
        existingReview.setComments(request.getComments().trim());
        existingReview.setStrengths(request.getStrengths() != null ? request.getStrengths().trim() : null);
        existingReview.setImprovements(request.getImprovements() != null ? request.getImprovements().trim() : null);

        // Update workflow states dynamically if passed in payload parameter
        if (request.getStatus() != null && !request.getStatus().trim().isBlank()) {
            try {
                existingReview.setStatus(ReviewStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid standard corporate review pipeline status: " + request.getStatus());
            }
        }

        Review updated = reviewRepository.save(existingReview);
        return ReviewMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance review file not found with ID: " + id));

        if (review.getStatus() == ReviewStatus.SUBMITTED) {
            throw new BadRequestException("Archival Lockout: Formally submitted performance evaluation logs cannot be deleted from the database");
        }
        reviewRepository.delete(review);
    }
}