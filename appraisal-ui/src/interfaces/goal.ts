export type GoalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'COMPLETED'
  | 'APPROVED'
  | 'REJECTED';

export interface GoalRequest {
  title: string;
  description?: string;
  targetDate: string;
  userId: number;
  appraisalCycleId: number;
  status?: string;
}

export interface GoalResponse {
  id: number;
  title: string;
  description?: string;
  targetDate: string;
  status: GoalStatus;
  userId: number;
  employeeName: string;
  appraisalCycleId: number;
  cycleName: string;
  createdAt: string;
  updatedAt: string;
}
