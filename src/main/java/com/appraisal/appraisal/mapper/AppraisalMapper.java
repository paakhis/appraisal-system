package com.appraisal.appraisal.mapper;

import com.appraisal.appraisal.dtos.AppraisalRequest;
import com.appraisal.appraisal.dtos.AppraisalResponse;
import com.appraisal.appraisal.entity.Appraisal;

public class AppraisalMapper {

    public static Appraisal toEntity(AppraisalRequest request) {
        Appraisal appraisal = new Appraisal();
        appraisal.setEmployeeId(request.getEmployeeId());
        appraisal.setCycleId(request.getCycleId());
        return appraisal;
    }

    public static AppraisalResponse toResponse(Appraisal appraisal) {
        return new AppraisalResponse(
                appraisal.getId(),
                appraisal.getEmployeeId(),
                appraisal.getCycleId(),
                appraisal.getSelfRating(),
                appraisal.getManagerRating(),
                appraisal.getFinalComment(),
                appraisal.getStatus(),
                appraisal.getCreatedAt(),
                appraisal.getUpdatedAt()
        );
    }
}
