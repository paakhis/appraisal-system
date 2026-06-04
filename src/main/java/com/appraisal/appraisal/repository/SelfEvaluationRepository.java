package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.SelfEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelfEvaluationRepository extends JpaRepository<SelfEvaluation, Long> {
}
