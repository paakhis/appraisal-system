package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface GoalRepository
        extends JpaRepository<Goal, Long> {
    @Query("SELECT g FROM Goal g JOIN FETCH g.user JOIN FETCH g.appraisalCycle")
    List<Goal> findAllWithRelationships();

    @Query("SELECT g FROM Goal g JOIN FETCH g.user JOIN FETCH g.appraisalCycle WHERE g.id = :id")
    Optional<Goal> findByIdWithRelationships(@Param("id") Long id);

    List<Goal> findByUserId(Long userId);
}