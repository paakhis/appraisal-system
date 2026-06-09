package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getUserNotifications(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    void markAsRead(Long notificationId);
}
