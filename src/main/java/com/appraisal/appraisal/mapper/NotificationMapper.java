package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.NotificationResponse;
import com.appraisal.appraisal.entity.Notification;
import com.appraisal.appraisal.entity.User;

public class NotificationMapper {

    public static Notification toEntity(NotificationRequest request, User user) {
        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(Enum.valueOf(
                com.appraisal.appraisal.entity.enums.NotificationType.class,
                request.getType()
        ));

        return notification;
    }

    public static NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUser().getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}
