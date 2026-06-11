package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByEmail(String email);

    // Dynamic fetch joins pull user, department, and manager variables in 1 database trip
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.department LEFT JOIN FETCH u.manager")
    List<User> findAllWithRelationships();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.department LEFT JOIN FETCH u.manager WHERE u.id = :id")
    Optional<User> findByIdWithRelationships(@Param("id") Long id);

    // Checks if any employee reports directly to this manager before deletion
    boolean existsByManagerId(Long managerId);
}
