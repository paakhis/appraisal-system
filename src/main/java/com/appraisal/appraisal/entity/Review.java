package com.appraisal.appraisal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Employee being reviewed
    private Long employeeId;

    // Manager who wrote review
    private Long managerId;

    // Appraisal cycle reference
    private Long cycleId;

    private Double performanceRating;

    private String comments;

    private String strengths;

    private String improvements;

    private String status;
    // DRAFT, SUBMITTED, APPROVED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "DRAFT";
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
