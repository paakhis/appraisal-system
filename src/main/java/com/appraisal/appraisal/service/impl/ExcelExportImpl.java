package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.repository.*;

import com.appraisal.appraisal.service.ExcelExportService;
import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportImpl implements ExcelExportService {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final ReviewRepository reviewRepository;
    private final SelfEvaluationRepository selfEvaluationRepository;
    private final AppraisalRepository appraisalRepository;
    private final DepartmentRepository departmentRepository;

    private CellStyle createHeaderStyle(Workbook workbook){

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);

        font.setColor(IndexedColors.WHITE.getIndex());

        style.setFont(font);

        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());

        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        style.setAlignment(HorizontalAlignment.CENTER);

        return style;

    }

    private void autoSize(Sheet sheet,int columns){

        for(int i=0;i<columns;i++){

            sheet.autoSizeColumn(i);

        }

    }
    @Override
    public ByteArrayInputStream exportHRReport() {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {

            createHRReport(workbook);

            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {

            throw new RuntimeException("Unable to generate HR Report", e);

        }
    }

    @Override
    public ByteArrayInputStream exportManagerReport(Long managerId) {

        throw new UnsupportedOperationException("Coming next");

    }

    private void createHRReport(Workbook workbook) {

    }


}
