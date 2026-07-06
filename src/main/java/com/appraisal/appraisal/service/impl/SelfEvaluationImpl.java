package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.SelfEvaluation;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.*;
import com.appraisal.appraisal.mapper.SelfEvaluationMapper;
import com.appraisal.appraisal.repository.*;
import com.appraisal.appraisal.service.NotificationService;
import com.appraisal.appraisal.service.SelfEvaluationService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SelfEvaluationImpl implements SelfEvaluationService {

    private final SelfEvaluationRepository selfEvaluationRepository;
    private final UserRepository userRepository;
    private final AppraisalCycleRepository appraisalCycleRepository;
    private final SelfEvaluationMapper selfEvaluationMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public SelfEvaluationResponse createSelfEvaluation(SelfEvaluationRequest request) {
        if (request == null) {
            throw new BadRequestException("Request payload body content cannot be null");
        }

        // Rule Safeguard: Prevent multiple submissions per employee per cycle
        if (selfEvaluationRepository.existsByUserIdAndAppraisalCycleId(request.getUserId(), request.getAppraisalCycleId())) {
            throw new DuplicateResourceException("A self-evaluation file already exists for this employee within this tracking cycle");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        AppraisalCycle cycle = appraisalCycleRepository.findById(request.getAppraisalCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal Cycle record not found with ID: " + request.getAppraisalCycleId()));

        // Rule Safeguard: Block entries for closed/inactive cycles
        if (cycle.getActive() != null && !cycle.getActive()) {
            throw new BadRequestException("Cannot submit evaluation records under an inactive or closed appraisal cycle window");
        }

        SelfEvaluation selfEvaluation = new SelfEvaluation();
        selfEvaluation.setAchievements(request.getAchievements().trim());
        selfEvaluation.setChallenges(request.getChallenges() != null ? request.getChallenges().trim() : null);
        selfEvaluation.setComments(request.getComments() != null ? request.getComments().trim() : null);
        selfEvaluation.setUser(user);
        selfEvaluation.setAppraisalCycle(cycle);

        SelfEvaluation saved = selfEvaluationRepository.save(selfEvaluation);

        notifySelfEvaluationCreated(saved, user, cycle);

        return selfEvaluationMapper.toResponse(saved);
    }

    private void notifySelfEvaluationCreated(SelfEvaluation selfEvaluation, User user, AppraisalCycle cycle) {
        notificationService.sendNotification(new NotificationRequest(
                user.getId(),
                "Self Appraisal Submitted",
                "Your self appraisal for cycle '" + cycle.getName() + "' has been submitted successfully.",
                "APPRAISAL"
        ));

        if (user.getManager() != null) {
            notificationService.sendNotification(new NotificationRequest(
                    user.getManager().getId(),
                    "Self Appraisal Submitted by Team Member",
                    user.getName() + " has submitted their self appraisal for cycle '" + cycle.getName() + "'.",
                    "APPRAISAL"
            ));
        }
    }

    @Override
    public List<SelfEvaluationResponse> getAllSelfEvaluations() {
        return selfEvaluationRepository.findAllWithRelationships()
                .stream()
                .map(selfEvaluationMapper::toResponse)
                .toList();
    }

    @Override
    public SelfEvaluationResponse getSelfEvaluationById(Long id) {
        SelfEvaluation selfEvaluation = selfEvaluationRepository.findByIdWithRelationships(id)
                .orElseThrow(() -> new ResourceNotFoundException("Self Evaluation not found with ID: " + id));
        return selfEvaluationMapper.toResponse(selfEvaluation);
    }

    @Override
    @Transactional
    public SelfEvaluationResponse updateSelfEvaluation(Long id, SelfEvaluationRequest request) {
        if (request == null) {
            throw new BadRequestException("Update request payload body content cannot be null");
        }

        SelfEvaluation selfEvaluation = selfEvaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Self Evaluation data file not found with ID: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        AppraisalCycle cycle = appraisalCycleRepository.findById(request.getAppraisalCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal Cycle record not found with ID: " + request.getAppraisalCycleId()));

        // Ensure users don't accidentally update their evaluation into an inactive cycle
        if (cycle.getActive() != null && !cycle.getActive()) {
            throw new BadRequestException("Cannot update evaluation records under an inactive or closed appraisal cycle window");
        }

        // Manage contextual swap tracking securely
        if (!selfEvaluation.getAppraisalCycle().getId().equals(request.getAppraisalCycleId()) &&
                selfEvaluationRepository.existsByUserIdAndAppraisalCycleId(request.getUserId(), request.getAppraisalCycleId())) {
            throw new DuplicateResourceException("An evaluation card duplicate already exists inside that targeted destination cycle window");
        }

        selfEvaluation.setAchievements(request.getAchievements().trim());
        selfEvaluation.setChallenges(request.getChallenges() != null ? request.getChallenges().trim() : null);
        selfEvaluation.setComments(request.getComments() != null ? request.getComments().trim() : null);
        selfEvaluation.setUser(user);
        selfEvaluation.setAppraisalCycle(cycle);

        SelfEvaluation updated = selfEvaluationRepository.save(selfEvaluation);
        return selfEvaluationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSelfEvaluation(Long id) {
        SelfEvaluation selfEvaluation = selfEvaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Self Evaluation file not found with ID: " + id));
        selfEvaluationRepository.delete(selfEvaluation);
    }
}