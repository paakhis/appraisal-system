package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEmployeeId(Long employeeId);

    List<Review> findByManagerId(Long managerId);

    List<Review> findByCycleId(Long cycleId);
}
