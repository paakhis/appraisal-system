package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.AppraisalCycle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppraisalCycleRepository
        extends JpaRepository<AppraisalCycle, Long> {

    boolean existsByNameIgnoreCase(String name);
}
