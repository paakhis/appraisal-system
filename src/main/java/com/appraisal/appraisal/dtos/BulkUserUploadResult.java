package com.appraisal.appraisal.dtos;

import com.appraisal.appraisal.dtos.BulkCreatedUser;
import com.appraisal.appraisal.dtos.BulkUploadRowError;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Summary returned to HR after uploading a bulk-hiring spreadsheet. Valid
// rows are created even if other rows in the same file fail, so HR doesn't
// lose 49 good rows because row 50 had a typo — the errors list tells them
// exactly what to fix and re-upload.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUserUploadResult {
    private int totalRows;
    private int successCount;
    private int failureCount;
    private List<BulkCreatedUser> createdUsers;
    private List<BulkUploadRowError> errors;
}