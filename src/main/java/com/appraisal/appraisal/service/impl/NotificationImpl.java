package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.NotificationResponse;
import com.appraisal.appraisal.entity.Notification;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.NotificationMapper;
import com.appraisal.appraisal.repository.NotificationRepository;
import com.appraisal.appraisal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
