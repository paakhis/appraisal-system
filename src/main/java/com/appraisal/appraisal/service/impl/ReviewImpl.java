package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.*;
import com.appraisal.appraisal.entity.Review;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.ReviewMapper;
import com.appraisal.appraisal.repository.ReviewRepository;
import com.appraisal.appraisal.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        Review review = ReviewMapper.toEntity(request);
        Review saved = reviewRepository.save(review);
        return ReviewMapper.toResponse(saved);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        return ReviewMapper.toResponse(review);
    }
}
