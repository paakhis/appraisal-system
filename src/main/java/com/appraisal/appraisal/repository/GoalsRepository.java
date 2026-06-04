package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Goals;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalsRepository
        extends JpaRepository<Goals, Long> {
}