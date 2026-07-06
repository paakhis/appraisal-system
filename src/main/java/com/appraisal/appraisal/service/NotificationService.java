package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse sendNotification(NotificationRequest request);

    List<NotificationResponse> getUserNotifications(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    NotificationResponse markAsRead(Long notificationId);

    List<NotificationResponse> getLatestNotifications(Long userId);

long getUnreadCount(Long userId);

void markAllAsRead(Long userId);
}
