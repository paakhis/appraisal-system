package com.appraisal.appraisal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appraisals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appraisal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who is being evaluated (we will link User later)
    private Long employeeId;

    // cycle reference
    private Long cycleId;

    private Double selfRating;

    private Double managerRating;

    private String finalComment;

    private String status;
    // DRAFT, SUBMITTED, REVIEWED, COMPLETED

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
