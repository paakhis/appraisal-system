package com.appraisal.appraisal.service;

import java.io.ByteArrayInputStream;

public interface ExcelExportService {

    ByteArrayInputStream exportHRReport();

    ByteArrayInputStream exportManagerReport(Long managerId);

}