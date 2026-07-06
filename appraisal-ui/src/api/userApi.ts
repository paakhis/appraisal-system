import api from './axios';
import type { UserRequest, UserResponse, BulkUserResponse } from '../interfaces/user';

export const createUser = (data: UserRequest) => api.post<UserResponse>('/api/users', data).then(r => r.data);
export const createUsersBulk = (data: UserRequest[]) => api.post<BulkUserResponse>('/api/users/bulk', data).then(r => r.data);
export const getAllUsers = () => api.get<UserResponse[]>('/api/users').then(r => r.data);
export const getUserById = (id: number) => api.get<UserResponse>(`/api/users/${id}`).then(r => r.data);
export const updateUser = (id: number, data: UserRequest) => api.put<UserResponse>(`/api/users/${id}`, data).then(r => r.data);
export const deleteUser = (id: number) => api.delete(`/api/users/${id}`).then(r => r.data);
