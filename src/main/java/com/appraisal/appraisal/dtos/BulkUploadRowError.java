package com.appraisal.appraisal.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadRowError {
    private int row;
    private String email;
    private String message;
}
