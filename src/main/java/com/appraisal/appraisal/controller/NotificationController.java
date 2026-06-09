package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.NotificationResponse;
import com.appraisal.appraisal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<NotificationResponse> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/unread/{userId}")
    public List<NotificationResponse> getUnread(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}
