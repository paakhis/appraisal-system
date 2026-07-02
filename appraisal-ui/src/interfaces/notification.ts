export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'APPRAISAL' | 'REVIEW' | 'GOAL';
export interface NotificationRequest { userId: number; title: string; message: string; type: string; }
export interface NotificationResponse { id: number; userId: number; title: string; message: string; type: string; isRead: boolean; createdAt: string; }
