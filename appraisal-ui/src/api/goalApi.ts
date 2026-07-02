import api from './axios';
import type { GoalRequest, GoalResponse } from '../interfaces/goal';

export const createGoal = (data: GoalRequest) => api.post<GoalResponse>('/api/goals', data).then(r => r.data);
export const getAllGoals = () => api.get<GoalResponse[]>('/api/goals').then(r => r.data);
export const getGoalById = (id: number) => api.get<GoalResponse>(`/api/goals/${id}`).then(r => r.data);
export const updateGoal = (id: number, data: GoalRequest) => api.put<GoalResponse>(`/api/goals/${id}`, data).then(r => r.data);
export const deleteGoal = (id: number) => api.delete(`/api/goals/${id}`).then(r => r.data);
export const submitGoal = async (id: number): Promise<GoalResponse> => {
  const response = await api.patch<GoalResponse>(`/api/goals/${id}/submit`);
  return response.data;
};
export const acknowledgeGoal = async (id: number): Promise<GoalResponse> => {
  const response = await api.patch<GoalResponse>(`/api/goals/${id}/acknowledge`);
  return response.data;
};
export const completeGoal = async (id: number): Promise<GoalResponse> => {
  const response = await api.patch<GoalResponse>(`/api/goals/${id}/complete`);
  return response.data;
};
export const approveGoal = async (id: number): Promise<GoalResponse> => {
  const response = await api.patch<GoalResponse>(`/api/goals/${id}/approve`);
  return response.data;
};
export const rejectGoal = async (id: number): Promise<GoalResponse> => {
  const response = await api.patch<GoalResponse>(`/api/goals/${id}/reject`);
  return response.data;
};
