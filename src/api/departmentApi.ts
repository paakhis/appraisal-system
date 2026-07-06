import api from './axios';
import type { DepartmentRequest, DepartmentResponse } from '../interfaces/department';

export const createDepartment = (data: DepartmentRequest) => api.post<DepartmentResponse>('/api/departments', data).then(r => r.data);
export const getAllDepartments = () => api.get<DepartmentResponse[]>('/api/departments').then(r => r.data);
export const getDepartmentById = (id: number) => api.get<DepartmentResponse>(`/api/departments/${id}`).then(r => r.data);
export const updateDepartment = (id: number, data: DepartmentRequest) => api.put<DepartmentResponse>(`/api/departments/${id}`, data).then(r => r.data);
export const deleteDepartment = (id: number) => api.delete(`/api/departments/${id}`).then(r => r.data);
