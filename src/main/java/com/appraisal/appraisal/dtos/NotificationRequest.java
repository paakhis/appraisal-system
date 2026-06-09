package com.appraisal.appraisal.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private Long userId;
    private String title;
    private String message;
    private String type;
}
