import api from './axios';
import type { NotificationRequest, NotificationResponse } from '../interfaces/notification';

export const sendNotification = (data: NotificationRequest) => api.post<NotificationResponse>('/api/notifications', data).then(r => r.data);
export const getUserNotifications = (userId: number) => api.get<NotificationResponse[]>(`/api/notifications/user/${userId}`).then(r => r.data);
export const getUnreadNotifications = (userId: number) => api.get<NotificationResponse[]>(`/api/notifications/user/${userId}/unread`).then(r => r.data);
export const markAsRead = (id: number) => api.patch<NotificationResponse>(`/api/notifications/${id}/read`).then(r => r.data);
export const getLatestNotifications = (userId: number) =>
  api.get<NotificationResponse[]>(`/api/notifications/user/${userId}/latest`)
    .then(r => r.data);

export const getUnreadCount = (userId: number) =>
  api.get<number>(`/api/notifications/user/${userId}/count`)
    .then(r => r.data);

export const markAllAsRead = (userId: number) =>
  api.patch(`/api/notifications/user/${userId}/read-all`);
