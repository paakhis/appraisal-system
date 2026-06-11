package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdWithRelationshipsOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndIsReadFalseWithRelationships(@Param("userId") Long userId);
}
