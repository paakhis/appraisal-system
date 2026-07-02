package com.appraisal.appraisal.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appraisal.appraisal.dtos.SelfEvaluationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationResponse;
import com.appraisal.appraisal.entity.Appraisal;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.SelfEvaluation;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.entity.enums.AppraisalStatus;
import com.appraisal.appraisal.exception.BadRequestException;
import com.appraisal.appraisal.exception.DuplicateResourceException;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.SelfEvaluationMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.AppraisalRepository;
import com.appraisal.appraisal.repository.SelfEvaluationRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.NotificationEventService;
import com.appraisal.appraisal.service.SelfEvaluationService;

import lombok.RequiredArgsConstructor;

@Service 

    @RequiredArgsConstructor
    @Transactional(readOnly = true)
    public class SelfEvaluationImpl implements SelfEvaluationService {

        private final SelfEvaluationRepository selfEvaluationRepository;
        private final UserRepository userRepository;
        private final AppraisalCycleRepository appraisalCycleRepository;
        private final SelfEvaluationMapper selfEvaluationMapper;
        private final AppraisalRepository appraisalRepository;
        private final NotificationEventService notificationEventService;

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

            Appraisal appraisal = appraisalRepository
                    .findByEmployeeIdAndCycleId(request.getUserId(), request.getAppraisalCycleId())
                    .orElse(null);

            if (appraisal != null && appraisal.getStatus() != AppraisalStatus.DRAFT) {
                throw new BadRequestException("This appraisal has already been submitted and can no longer be edited.");
            }

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

            notificationEventService.selfEvaluationSubmitted(saved);

            return selfEvaluationMapper.toResponse(saved);
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
                    .orElseThrow(() -> new ResourceNotFoundException(
                    "Self Evaluation data file not found with ID: " + id));

            Appraisal appraisal = appraisalRepository
                    .findByEmployeeIdAndCycleId(
                            selfEvaluation.getUser().getId(),
                            selfEvaluation.getAppraisalCycle().getId()
                    )
                    .orElseThrow(() -> new ResourceNotFoundException(
                    "Associated appraisal not found"));

            // LOCK AFTER SUBMISSION
            if (appraisal.getStatus() != AppraisalStatus.DRAFT) {
                throw new BadRequestException(
                        "Self evaluation has already been submitted and can no longer be edited."
                );
            }

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with ID: " + request.getUserId()));

            AppraisalCycle cycle = appraisalCycleRepository.findById(request.getAppraisalCycleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Appraisal Cycle record not found with ID: " + request.getAppraisalCycleId()));

            if (cycle.getActive() != null && !cycle.getActive()) {
                throw new BadRequestException(
                        "Cannot update evaluation records under an inactive or closed appraisal cycle window");
            }

            if (!selfEvaluation.getAppraisalCycle().getId().equals(request.getAppraisalCycleId())
                    && selfEvaluationRepository.existsByUserIdAndAppraisalCycleId(
                            request.getUserId(),
                            request.getAppraisalCycleId())) {

                throw new DuplicateResourceException(
                        "An evaluation already exists for this appraisal cycle.");
            }

            selfEvaluation.setAchievements(request.getAchievements().trim());
            selfEvaluation.setChallenges(
                    request.getChallenges() != null
                    ? request.getChallenges().trim()
                    : null);

            selfEvaluation.setComments(
                    request.getComments() != null
                    ? request.getComments().trim()
                    : null);

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
