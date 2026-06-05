package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Appraisal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {

    List<Appraisal> findByEmployeeId(Long employeeId);

    List<Appraisal> findByCycleId(Long cycleId);
}
