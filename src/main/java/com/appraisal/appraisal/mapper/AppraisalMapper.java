package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.Appraisal;

public class AppraisalMapper {

    public static AppraisalResponse toResponse(Appraisal appraisal) {
        if (appraisal == null) {
            return null;
        }

        AppraisalResponse response = new AppraisalResponse();
        response.setId(appraisal.getId());
        response.setSelfRating(appraisal.getSelfRating());
        response.setManagerRating(appraisal.getManagerRating());
        response.setFinalComment(appraisal.getFinalComment());
        response.setStatus(appraisal.getStatus());
        response.setCreatedAt(appraisal.getCreatedAt());
        response.setUpdatedAt(appraisal.getUpdatedAt());

        if (appraisal.getEmployee() != null) {
            response.setEmployeeId(appraisal.getEmployee().getId());
            response.setEmployeeName(appraisal.getEmployee().getName());
        }

        if (appraisal.getManager() != null) {
            response.setManagerId(appraisal.getManager().getId());
            response.setManagerName(appraisal.getManager().getName());
        }

        if (appraisal.getCycle() != null) {
            response.setCycleId(appraisal.getCycle().getId());
            response.setCycleName(appraisal.getCycle().getName());
        }

        return response;
    }
}