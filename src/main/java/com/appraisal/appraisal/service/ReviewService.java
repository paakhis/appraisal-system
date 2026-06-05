package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.ReviewRequest;
import com.appraisal.appraisal.dtos.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(ReviewRequest request);

    List<ReviewResponse> getAllReviews();

    ReviewResponse getReviewById(Long id);
}
