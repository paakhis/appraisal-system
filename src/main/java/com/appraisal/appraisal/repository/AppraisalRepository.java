package com.appraisal.appraisal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appraisal.appraisal.entity.Appraisal;

@Repository
public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {

    // Ensures an employee cannot have duplicate appraisals for the same cycle
    boolean existsByEmployeeIdAndCycleId(Long employeeId, Long cycleId);

    // One efficient query fetches everything, preventing N+1 performance issues
    @Query("SELECT a FROM Appraisal a JOIN FETCH a.employee JOIN FETCH a.manager JOIN FETCH a.cycle")
    List<Appraisal> findAllWithRelationships();

    @Query("SELECT a FROM Appraisal a JOIN FETCH a.employee JOIN FETCH a.manager JOIN FETCH a.cycle WHERE a.id = :id")
    Optional<Appraisal> findByIdWithRelationships(@Param("id") Long id);

    List<Appraisal> findByEmployeeId(Long employeeId);
    List<Appraisal> findByCycleId(Long cycleId);

    @Query("""
       SELECT a
       FROM Appraisal a
       WHERE a.employee.id = :employeeId
       AND a.cycle.id = :cycleId
       """)
Optional<Appraisal> findByEmployeeIdAndCycleId(Long employeeId, Long cycleId);
}
