package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.SelfEvaluationRequest;
import com.appraisal.appraisal.dtos.SelfEvaluationResponse;
import com.appraisal.appraisal.entity.AppraisalCycle;
import com.appraisal.appraisal.entity.SelfEvaluation;
import com.appraisal.appraisal.entity.User;
import com.appraisal.appraisal.exception.ResourceNotFoundException;
import com.appraisal.appraisal.mapper.SelfEvaluationMapper;
import com.appraisal.appraisal.repository.AppraisalCycleRepository;
import com.appraisal.appraisal.repository.SelfEvaluationRepository;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.service.SelfEvaluationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SelfEvaluationImpl implements SelfEvaluationService {

    private final SelfEvaluationRepository selfEvaluationRepository;

    private final UserRepository userRepository;

    private final AppraisalCycleRepository appraisalCycleRepository;

    private final SelfEvaluationMapper selfEvaluationMapper;

    public SelfEvaluationImpl(
            SelfEvaluationRepository selfEvaluationRepository,
            UserRepository userRepository,
            AppraisalCycleRepository appraisalCycleRepository,
            SelfEvaluationMapper selfEvaluationMapper) {

        this.selfEvaluationRepository =
                selfEvaluationRepository;

        this.userRepository =
                userRepository;

        this.appraisalCycleRepository =
                appraisalCycleRepository;

        this.selfEvaluationMapper =
                selfEvaluationMapper;
    }

    @Override
    public SelfEvaluationResponse createSelfEvaluation(
            SelfEvaluationRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(
                                request.getAppraisalCycleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        SelfEvaluation selfEvaluation =
                new SelfEvaluation();

        selfEvaluation.setAchievements(
                request.getAchievements());

        selfEvaluation.setChallenges(
                request.getChallenges());

        selfEvaluation.setComments(
                request.getComments());

        selfEvaluation.setUser(user);

        selfEvaluation.setAppraisalCycle(cycle);

        SelfEvaluation savedSelfEvaluation =
                selfEvaluationRepository.save(
                        selfEvaluation);

        return selfEvaluationMapper.toResponse(
                savedSelfEvaluation);
    }

//    @Override
//    public SelfEvaluationResponse createSelfEvaluation(SelfEvaluationRequest request) {
//        return null;
//    }

    @Override
    public List<SelfEvaluationResponse>
    getAllSelfEvaluations() {

        return selfEvaluationRepository
                .findAll()
                .stream()
                .map(
                        selfEvaluationMapper::toResponse
                )
                .toList();
    }

    @Override
    public SelfEvaluationResponse
    getSelfEvaluationById(Long id) {

        SelfEvaluation selfEvaluation =
                selfEvaluationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Self Evaluation not found"));

        return selfEvaluationMapper.toResponse(
                selfEvaluation);
    }

    @Override
    public SelfEvaluationResponse
    updateSelfEvaluation(
            Long id,
            SelfEvaluationRequest request) {

        SelfEvaluation selfEvaluation =
                selfEvaluationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Self Evaluation not found"));

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        AppraisalCycle cycle =
                appraisalCycleRepository
                        .findById(
                                request.getAppraisalCycleId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Appraisal Cycle not found"));

        selfEvaluation.setAchievements(
                request.getAchievements());

        selfEvaluation.setChallenges(
                request.getChallenges());

        selfEvaluation.setComments(
                request.getComments());

        selfEvaluation.setUser(user);

        selfEvaluation.setAppraisalCycle(cycle);

        SelfEvaluation updatedSelfEvaluation =
                selfEvaluationRepository.save(
                        selfEvaluation);

        return selfEvaluationMapper.toResponse(
                updatedSelfEvaluation);
    }

    @Override
    public void deleteSelfEvaluation(Long id) {

        SelfEvaluation selfEvaluation =
                selfEvaluationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Self Evaluation not found"));

        selfEvaluationRepository.delete(
                selfEvaluation);
    }
}
