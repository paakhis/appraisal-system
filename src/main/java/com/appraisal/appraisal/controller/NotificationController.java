package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.NotificationResponse;
import com.appraisal.appraisal.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        return new ResponseEntity<>(notificationService.sendNotification(request), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @GetMapping("/user/{userId}/latest")
public ResponseEntity<List<NotificationResponse>> latest(
        @PathVariable Long userId){

    return ResponseEntity.ok(
            notificationService.getLatestNotifications(userId)
    );
}

@GetMapping("/user/{userId}/count")
public ResponseEntity<Long> unreadCount(
        @PathVariable Long userId){

    return ResponseEntity.ok(
            notificationService.getUnreadCount(userId)
    );
}

@PatchMapping("/user/{userId}/read-all")
public ResponseEntity<Void> markAll(
        @PathVariable Long userId){

    notificationService.markAllAsRead(userId);

    return ResponseEntity.noContent().build();
}
}
