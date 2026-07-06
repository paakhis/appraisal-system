import api from './axios';
import type { AppraisalRequest, AppraisalResponse } from '../interfaces/appraisal';

export const createAppraisal = (data: AppraisalRequest) => api.post<AppraisalResponse>('/api/appraisals', data).then(r => r.data);
export const getAllAppraisals = () => api.get<AppraisalResponse[]>('/api/appraisals').then(r => r.data);
export const getAppraisalById = (id: number) => api.get<AppraisalResponse>(`/api/appraisals/${id}`).then(r => r.data);
export const updateAppraisalStatus = (id: number, status: string) => api.patch<AppraisalResponse>(`/api/appraisals/${id}/status?status=${status}`).then(r => r.data);
export const deleteAppraisal = (id: number) => api.delete(`/api/appraisals/${id}`).then(r => r.data);
