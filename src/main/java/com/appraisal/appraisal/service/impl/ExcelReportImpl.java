package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.*;
import com.appraisal.appraisal.service.ExcelReportService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;

import static com.appraisal.appraisal.service.impl.ExcelStyleHelper.headerRowStyle;
import static com.appraisal.appraisal.service.impl.ExcelStyleHelper.*;

@Service
public class ExcelReportImpl implements ExcelReportService {

    @Override
    public byte[] buildCycleReportWorkbook(CycleReportResponse report) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Cycle Report");
            CellStyle title = titleStyle(workbook);
            CellStyle subtitle = subtitleStyle(workbook);
            CellStyle sectionHeader = sectionHeaderStyle(workbook);
            CellStyle headerRow = headerRowStyle(workbook);

            int r = 0;
            Row titleRow = sheet.createRow(r++);
            cell(titleRow, 0, "Appraisal Cycle Report — " + report.getCycle(), title);
            r++;

            // ---- Summary -------------------------------------------------
            Row summaryHeader = sheet.createRow(r++);
            cell(summaryHeader, 0, "Summary", sectionHeader);
            cell(summaryHeader, 1, "", sectionHeader);

            r = writeKeyValue(sheet, r, "Total Appraisals", report.getTotalAppraisals());
            r = writeKeyValue(sheet, r, "Completion %", report.getCompletionPercent());
            r = writeKeyValue(sheet, r, "Pending Action Count", report.getPendingActionCount());
            r = writeKeyValue(sheet, r, "Average Rating",
                    report.getAvgRating() == null ? "—" : report.getAvgRating());
            r++;

            // ---- Status breakdown -----------------------------------------
            Row statusHeader = sheet.createRow(r++);
            cell(statusHeader, 0, "Status Breakdown", sectionHeader);
            cell(statusHeader, 1, "", sectionHeader);

            Row statusCols = sheet.createRow(r++);
            cell(statusCols, 0, "Status", headerRow);
            cell(statusCols, 1, "Count", headerRow);
            if (report.getStatusBreakdown() != null) {
                for (StatusBreakdownEntry entry : report.getStatusBreakdown()) {
                    Row row = sheet.createRow(r++);
                    cell(row, 0, entry.getStatus(), null);
                    cell(row, 1, entry.getCount(), null);
                }
            }
            r++;

            // ---- Rating distribution ---------------------------------------
            Row ratingHeader = sheet.createRow(r++);
            cell(ratingHeader, 0, "Rating Distribution", sectionHeader);
            cell(ratingHeader, 1, "", sectionHeader);

            Row ratingCols = sheet.createRow(r++);
            cell(ratingCols, 0, "Rating (stars)", headerRow);
            cell(ratingCols, 1, "Count", headerRow);
            if (report.getRatingDistribution() != null) {
                for (RatingDistributionEntry entry : report.getRatingDistribution()) {
                    Row row = sheet.createRow(r++);
                    cell(row, 0, entry.getRating(), null);
                    cell(row, 1, entry.getCount(), null);
                }
            }
            r++;

            // ---- By department ----------------------------------------------
            Row deptHeader = sheet.createRow(r++);
            cell(deptHeader, 0, "By Department", sectionHeader);
            for (int c = 1; c <= 4; c++) {
                cell(deptHeader, c, "", sectionHeader);
            }

            Row deptCols = sheet.createRow(r++);
            String[] deptColumns = {"Department", "Employees", "Completed", "Pending", "Avg Rating"};
            for (int c = 0; c < deptColumns.length; c++) {
                cell(deptCols, c, deptColumns[c], headerRow);
            }
            if (report.getByDepartment() != null) {
                for (DepartmentReportRow row : report.getByDepartment()) {
                    Row xr = sheet.createRow(r++);
                    cell(xr, 0, row.getDepartment(), null);
                    cell(xr, 1, row.getEmployees(), null);
                    cell(xr, 2, row.getCompleted(), null);
                    cell(xr, 3, row.getPending(), null);
                    cell(xr, 4, row.getAvgRating() == null ? "—" : row.getAvgRating(), null);
                }
            }
            r++;

            // ---- Pending actions ---------------------------------------------
            Row pendingHeader = sheet.createRow(r++);
            cell(pendingHeader, 0, "Pending Actions (not yet acknowledged)", sectionHeader);
            for (int c = 1; c <= 3; c++) {
                cell(pendingHeader, c, "", sectionHeader);
            }

            Row pendingCols = sheet.createRow(r++);
            String[] pendingColumns = {"Employee", "Department", "Manager", "Current Status"};
            for (int c = 0; c < pendingColumns.length; c++) {
                cell(pendingCols, c, pendingColumns[c], headerRow);
            }
            if (report.getPendingActions() != null) {
                for (PendingActionRow row : report.getPendingActions()) {
                    Row xr = sheet.createRow(r++);
                    cell(xr, 0, row.getEmployeeName(), null);
                    cell(xr, 1, row.getDepartment(), null);
                    cell(xr, 2, row.getManagerName(), null);
                    cell(xr, 3, row.getStatus(), null);
                }
            }

            autoSizeColumns(sheet, 5);
            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to build cycle report workbook", e);
        }
    }

    @Override
    public byte[] buildTeamReportWorkbook(TeamReportResponse report) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Team Report");
            CellStyle title = titleStyle(workbook);
            CellStyle sectionHeader = sectionHeaderStyle(workbook);
            CellStyle headerRow = headerRowStyle(workbook);

            int r = 0;
            Row titleRow = sheet.createRow(r++);
            cell(titleRow, 0, "Team Report — " + report.getCycle(), title);
            r++;

            r = writeKeyValue(sheet, r, "Team Members", report.getTeamMembers());
            r = writeKeyValue(sheet, r, "Average Rating",
                    report.getAvgRating() == null ? "—" : report.getAvgRating());
            r++;

            Row colsHeaderRow = sheet.createRow(r++);
            cell(colsHeaderRow, 0, "Team Members", sectionHeader);
            for (int c = 1; c <= 6; c++) {
                cell(colsHeaderRow, c, "", sectionHeader);
            }

            Row cols = sheet.createRow(r++);
            String[] columns = {"Employee", "Job Title", "Status", "Self Rating", "Manager Rating",
                    "Goals Completed", "Goals Total"};
            for (int c = 0; c < columns.length; c++) {
                cell(cols, c, columns[c], headerRow);
            }

            if (report.getRows() != null) {
                for (TeamReportRow row : report.getRows()) {
                    Row xr = sheet.createRow(r++);
                    cell(xr, 0, row.getEmployeeName(), null);
                    cell(xr, 1, row.getJobTitle(), null);
                    cell(xr, 2, row.getStatus(), null);
                    cell(xr, 3, row.getSelfRating() == null ? "—" : row.getSelfRating(), null);
                    cell(xr, 4, row.getManagerRating() == null ? "—" : row.getManagerRating(), null);
                    cell(xr, 5, row.getGoalsCompleted(), null);
                    cell(xr, 6, row.getGoalsTotal(), null);
                }
            }

            autoSizeColumns(sheet, columns.length);
            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to build team report workbook", e);
        }
    }

    private int writeKeyValue(Sheet sheet, int rowIndex, String label, Object value) {
        Row row = sheet.createRow(rowIndex);
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(label);
        cell(row, 1, value, null);
        return rowIndex + 1;
    }

    private byte[] toBytes(XSSFWorkbook workbook) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
