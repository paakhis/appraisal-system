package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse sendNotification(NotificationRequest request);

    List<NotificationResponse> getUserNotifications(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void deleteNotification(Long notificationId);
}
