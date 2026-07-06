package com.appraisal.appraisal.service;

import com.appraisal.appraisal.dtos.CycleReportResponse;
import com.appraisal.appraisal.dtos.TeamReportResponse;

// Renders the same data already shown on-screen (HR's cycle report, a
// manager's team report) into a downloadable .xlsx workbook, so both
// roles can export what they're looking at instead of screenshotting it.
public interface ExcelReportService {

    byte[] buildCycleReportWorkbook(CycleReportResponse report);

    byte[] buildTeamReportWorkbook(TeamReportResponse report);
}
