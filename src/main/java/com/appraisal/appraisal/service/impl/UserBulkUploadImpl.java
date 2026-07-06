package com.appraisal.appraisal.service.impl;
import com.appraisal.appraisal.dtos.BulkCreatedUser;
import com.appraisal.appraisal.dtos.BulkUploadRowError;
import com.appraisal.appraisal.dtos.BulkUserUploadResult;
import com.appraisal.appraisal.dtos.UserRequest;
import com.appraisal.appraisal.dtos.UserResponse;
import com.appraisal.appraisal.entity.Department;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.repository.DepartmentRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.UserBulkUploadService;
import com.appraisal.appraisal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

import static com.appraisal.appraisal.service.impl.ExcelStyleHelper.*;

/**
 * Reads the "bulk hiring" spreadsheet HR uploads and creates one user per
 * row, via the same {@link UserService#createUser} path a single manual
 * entry would use — so every validation rule (duplicate email, unknown
 * department, etc.) is enforced identically either way.
 *
 * Expected columns (row 1 = header, data starts row 2):
 *   A: Name*            B: Email*         C: Password (optional — a
 *   temporary one is generated if left blank)   D: Role* (HR/MANAGER/
 *   EMPLOYEE)   E: Job Title*   F: Department (name)*   G: Manager Email
 *   (optional)
 *
 * Each row is processed independently: a bad row is recorded as an error
 * and skipped, it never rolls back the rows that succeeded.
 */
@Service
@RequiredArgsConstructor
public class UserBulkUploadImpl implements UserBulkUploadService {

    private static final int COL_NAME = 0;
    private static final int COL_EMAIL = 1;
    private static final int COL_PASSWORD = 2;
    private static final int COL_ROLE = 3;
    private static final int COL_JOB_TITLE = 4;
    private static final int COL_DEPARTMENT = 5;
    private static final int COL_MANAGER_EMAIL = 6;

    private static final String[] TEMPLATE_HEADERS = {
            "Name", "Email", "Password (optional)", "Role", "Job Title", "Department", "Manager Email (optional)"
    };

    private final UserService userService;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    public BulkUserUploadResult uploadUsers(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please choose an Excel file to upload.");
        }

        List<BulkCreatedUser> created = new ArrayList<>();
        List<BulkUploadRowError> errors = new ArrayList<>();
        int totalRows = 0;

        try (InputStream in = file.getInputStream(); Workbook workbook = WorkbookFactory.create(in)) {
            if (workbook.getNumberOfSheets() == 0) {
                throw new BadRequestException("The uploaded file has no sheets.");
            }
            Sheet sheet = workbook.getSheetAt(0);

            int lastRowNum = sheet.getLastRowNum();
            for (int rowIndex = 1; rowIndex <= lastRowNum; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null || isRowBlank(row)) {
                    continue;
                }
                totalRows++;
                // Spreadsheet row numbers are 1-based and include the
                // header, so the first data row (rowIndex == 1) is "row 2"
                // to the person looking at it in Excel.
                int displayRow = rowIndex + 1;
                String email = stringValue(row, COL_EMAIL);

                try {
                    boolean passwordProvided = !isBlank(stringValue(row, COL_PASSWORD));
                    UserRequest request = buildRequest(row);
                    UserResponse response = userService.createUser(request);
                    String tempPassword = passwordProvided ? null : request.getPassword();
                    created.add(new BulkCreatedUser(response, tempPassword));
                } catch (Exception ex) {
                    errors.add(new BulkUploadRowError(displayRow, email, ex.getMessage()));
                }
            }
        } catch (IOException e) {
            throw new BadRequestException("Could not read the uploaded file. Please upload a valid .xlsx file.");
        }

        return new BulkUserUploadResult(totalRows, created.size(), errors.size(), created, errors);
    }

    private UserRequest buildRequest(Row row) {
        String name = stringValue(row, COL_NAME);
        String email = stringValue(row, COL_EMAIL);
        String password = stringValue(row, COL_PASSWORD);
        String role = stringValue(row, COL_ROLE);
        String jobTitle = stringValue(row, COL_JOB_TITLE);
        String departmentName = stringValue(row, COL_DEPARTMENT);
        String managerEmail = stringValue(row, COL_MANAGER_EMAIL);

        if (isBlank(name)) {
            throw new BadRequestException("Name is required");
        }
        if (isBlank(email)) {
            throw new BadRequestException("Email is required");
        }
        if (isBlank(role)) {
            throw new BadRequestException("Role is required (HR, MANAGER, or EMPLOYEE)");
        }
        if (isBlank(jobTitle)) {
            throw new BadRequestException("Job title is required");
        }
        if (isBlank(departmentName)) {
            throw new BadRequestException("Department is required");
        }
        if (!isBlank(password) && password.trim().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters (or leave it blank to auto-generate one)");
        }

        Department department = departmentRepository.findByNameIgnoreCase(departmentName.trim())
                .orElseThrow(() -> new BadRequestException(
                        "Unknown department \"" + departmentName + "\" — check the spelling matches an existing department"));

        Long managerId = null;
        if (!isBlank(managerEmail)) {
            User manager = userRepository.findByEmailIgnoreCase(managerEmail.trim())
                    .orElseThrow(() -> new BadRequestException(
                            "Unknown manager email \"" + managerEmail + "\" — the manager must already exist in the system"));
            managerId = manager.getId();
        }

        String finalPassword = isBlank(password) ? generateTemporaryPassword() : password.trim();

        return new UserRequest(name.trim(), email.trim(), finalPassword, role.trim(), jobTitle.trim(),
                department.getId(), managerId);
    }

    @Override
    public byte[] generateTemplate() {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("New Hires");
            CellStyle headerStyle = headerRowStyle(workbook);

            Row header = sheet.createRow(0);
            for (int c = 0; c < TEMPLATE_HEADERS.length; c++) {
                cell(header, c, TEMPLATE_HEADERS[c], headerStyle);
            }

            Row example = sheet.createRow(1);
            cell(example, COL_NAME, "Jane Doe", null);
            cell(example, COL_EMAIL, "jane.doe@example.com", null);
            cell(example, COL_PASSWORD, "", null);
            cell(example, COL_ROLE, "EMPLOYEE", null);
            cell(example, COL_JOB_TITLE, "Software Engineer", null);
            cell(example, COL_DEPARTMENT, departmentRepository.findAll().stream()
                    .findFirst().map(Department::getName).orElse("Engineering"), null);
            cell(example, COL_MANAGER_EMAIL, "", null);

            autoSizeColumns(sheet, TEMPLATE_HEADERS.length);

            // Reference sheet so HR knows what values are valid without
            // guessing — real department names pulled live from the DB.
            Sheet reference = workbook.createSheet("Valid Values");
            Row refHeader = reference.createRow(0);
            cell(refHeader, 0, "Roles", headerStyle);
            cell(refHeader, 1, "Departments", headerStyle);

            List<String> departmentNames = departmentRepository.findAll().stream()
                    .map(Department::getName).toList();
            String[] roles = {"HR", "MANAGER", "EMPLOYEE"};
            int maxRows = Math.max(roles.length, departmentNames.size());
            for (int i = 0; i < maxRows; i++) {
                Row r = reference.createRow(i + 1);
                if (i < roles.length) {
                    cell(r, 0, roles[i], null);
                }
                if (i < departmentNames.size()) {
                    cell(r, 1, departmentNames.get(i), null);
                }
            }
            autoSizeColumns(reference, 2);

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                workbook.write(out);
                return out.toByteArray();
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to build bulk upload template", e);
        }
    }

    private boolean isRowBlank(Row row) {
        for (int c = 0; c <= COL_MANAGER_EMAIL; c++) {
            if (!isBlank(stringValue(row, c))) {
                return false;
            }
        }
        return true;
    }

    private String stringValue(Row row, int col) {
        Cell c = row.getCell(col);
        if (c == null) {
            return null;
        }
        return switch (c.getCellType()) {
            case STRING -> c.getStringCellValue();
            case NUMERIC -> {
                double value = c.getNumericCellValue();
                yield value == Math.floor(value) ? String.valueOf((long) value) : String.valueOf(value);
            }
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            case FORMULA -> c.getCellFormula();
            default -> null;
        };
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static final String PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
    private static final SecureRandom RANDOM = new SecureRandom();

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}