package com.appraisal.appraisal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "self_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SelfEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String achievements;

    @Column(length = 2000)
    private String challenges;

    @Column(length = 2000)
    private String comments;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "appraisal_cycle_id", nullable = false)
    private AppraisalCycle appraisalCycle;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();}

    @PreUpdate
    public void onUpdate() {this.updatedAt = LocalDateTime.now();}
}
