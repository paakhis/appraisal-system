package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.ReviewRequest;
import com.appraisal.appraisal.dtos.ReviewResponse;
import com.appraisal.appraisal.entity.Review;

public class ReviewMapper {

    public static Review toEntity(ReviewRequest request) {
        Review review = new Review();

        review.setEmployeeId(request.getEmployeeId());
        review.setManagerId(request.getManagerId());
        review.setCycleId(request.getCycleId());
        review.setPerformanceRating(request.getPerformanceRating());
        review.setComments(request.getComments());
        review.setStrengths(request.getStrengths());
        review.setImprovements(request.getImprovements());

        return review;
    }

    public static ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getEmployeeId(),
                review.getManagerId(),
                review.getCycleId(),
                review.getPerformanceRating(),
                review.getComments(),
                review.getStrengths(),
                review.getImprovements(),
                review.getStatus(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
