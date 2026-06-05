package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.ReviewRequest;
import com.appraisal.appraisal.dtos.ReviewResponse;
import com.appraisal.appraisal.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponse create(@RequestBody ReviewRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping
    public List<ReviewResponse> getAll() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{id}")
    public ReviewResponse getById(@PathVariable Long id) {
        return reviewService.getReviewById(id);
    }
}
