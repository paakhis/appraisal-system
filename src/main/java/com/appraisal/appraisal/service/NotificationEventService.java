package com.appraisal.appraisal.service;

import com.appraisal.appraisal.entity.Goal;
import com.appraisal.appraisal.entity.Review;
import com.appraisal.appraisal.entity.SelfEvaluation;

public interface NotificationEventService {

    // Employee
    void goalAssigned(Goal goal);
    void goalApproved(Goal goal);
    void goalRejected(Goal goal);
    void reviewFinalized(Review review);

    // Manager
    void selfEvaluationSubmitted(SelfEvaluation selfEvaluation);
    void goalSubmitted(Goal goal);
    void goalCompleted(Goal goal);

    // HR
    void reviewSubmittedToHr(Review review);
}