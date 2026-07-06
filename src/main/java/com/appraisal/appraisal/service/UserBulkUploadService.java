package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.BulkUserUploadResult;
import org.springframework.web.multipart.MultipartFile;

// Lets HR add many new hires at once from a spreadsheet instead of the
// "one user per form submission" flow — the bulk-hiring use case.
public interface UserBulkUploadService {

    BulkUserUploadResult uploadUsers(MultipartFile file);

    // Blank starter workbook (headers + one example row + a sheet listing
    // valid department names and roles) that HR downloads, fills in, and
    // re-uploads via uploadUsers(...).
    byte[] generateTemplate();
}
