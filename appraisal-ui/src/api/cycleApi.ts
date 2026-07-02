import api from './axios';
import type { AppraisalCycleRequest, AppraisalCycleResponse } from '../interfaces/cycle';

export const createCycle = (data: AppraisalCycleRequest) => api.post<AppraisalCycleResponse>('/api/appraisal-cycles', data).then(r => r.data);
export const getAllCycles = () => api.get<AppraisalCycleResponse[]>('/api/appraisal-cycles').then(r => r.data);
export const getCycleById = (id: number) => api.get<AppraisalCycleResponse>(`/api/appraisal-cycles/${id}`).then(r => r.data);
export const updateCycle = (id: number, data: AppraisalCycleRequest) => api.put<AppraisalCycleResponse>(`/api/appraisal-cycles/${id}`, data).then(r => r.data);
export const deleteCycle = (id: number) => api.delete(`/api/appraisal-cycles/${id}`).then(r => r.data);
