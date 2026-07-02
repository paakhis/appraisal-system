import api from './axios';
import type { SelfEvaluationRequest, SelfEvaluationResponse } from '../interfaces/selfEval';

export const createSelfEval = (data: SelfEvaluationRequest) => api.post<SelfEvaluationResponse>('/api/self-evaluations', data).then(r => r.data);
export const getAllSelfEvals = () => api.get<SelfEvaluationResponse[]>('/api/self-evaluations').then(r => r.data);
export const getSelfEvalById = (id: number) => api.get<SelfEvaluationResponse>(`/api/self-evaluations/${id}`).then(r => r.data);
export const updateSelfEval = (id: number, data: SelfEvaluationRequest) => api.put<SelfEvaluationResponse>(`/api/self-evaluations/${id}`, data).then(r => r.data);
export const deleteSelfEval = (id: number) => api.delete(`/api/self-evaluations/${id}`).then(r => r.data);
