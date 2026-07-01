package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.NotificationResponse;
import com.appraisal.appraisal.entity.Notification;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.*;
import com.appraisal.appraisal.mapper.NotificationMapper;
import com.appraisal.appraisal.repository.NotificationRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.NotificationService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        if (request == null) {
            throw new BadRequestException("Notification transaction request context payload cannot be null");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Target recipient user not found with ID: " + request.getUserId()));

        Notification notification = NotificationMapper.toEntity(request, user);
        Notification saved = notificationRepository.save(notification);
        return NotificationMapper.toResponse(saved);
    }

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return notificationRepository.findByUserIdWithRelationshipsOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return notificationRepository.findByUserIdAndIsReadFalseWithRelationships(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Target notification tracking id not found: " + notificationId));

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return NotificationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseWithRelationships(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        notificationRepository.delete(notification);
    }
}