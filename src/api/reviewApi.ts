import api from './axios';
import type { ReviewRequest, ReviewResponse } from '../interfaces/review';

export const createReview = (data: ReviewRequest) => api.post<ReviewResponse>('/api/reviews', data).then(r => r.data);
export const getAllReviews = () => api.get<ReviewResponse[]>('/api/reviews').then(r => r.data);
export const getReviewById = (id: number) => api.get<ReviewResponse>(`/api/reviews/${id}`).then(r => r.data);
export const updateReview = (id: number, data: ReviewRequest) => api.put<ReviewResponse>(`/api/reviews/${id}`, data).then(r => r.data);
export const deleteReview = (id: number) => api.delete(`/api/reviews/${id}`).then(r => r.data);
