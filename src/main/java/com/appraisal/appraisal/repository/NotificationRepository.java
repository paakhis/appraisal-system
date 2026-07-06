package com.appraisal.appraisal.repository;

import com.appraisal.appraisal.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdWithRelationshipsOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n JOIN FETCH n.user WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndIsReadFalseWithRelationships(@Param("userId") Long userId);

    @Query("""
SELECT n
FROM Notification n
JOIN FETCH n.user
WHERE n.user.id = :userId
ORDER BY n.createdAt DESC
""")
List<Notification> findTop5ByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);


long countByUserIdAndIsReadFalse(Long userId);


@Modifying
@Query("""
UPDATE Notification n
SET n.isRead = true
WHERE n.user.id = :userId
AND n.isRead = false
""")
void markAllAsRead(@Param("userId") Long userId);
}
