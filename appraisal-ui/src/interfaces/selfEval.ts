export interface SelfEvaluationRequest { achievements: string; challenges?: string; comments?: string; userId: number; appraisalCycleId: number; }
export interface SelfEvaluationResponse {
  id: number; achievements: string; challenges?: string; comments?: string;
  userId: number; employeeName: string; appraisalCycleId: number; cycleName: string;
  createdAt: string; updatedAt: string;
}
