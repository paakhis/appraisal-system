package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.service.ExcelExportService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ExcelExportService excelExportService;

    @GetMapping("/employees")
    public ResponseEntity<InputStreamResource> downloadEmployees() {

        InputStreamResource file =
                new InputStreamResource(
                        excelExportService.exportHRReport()
                );

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Employees_Report.xlsx"
                )

                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )

                .body(file);

    }

}
