export type ReviewStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED';
export interface ReviewRequest {
  appraisalId: number; employeeId: number; managerId: number; performanceRating: number;
  comments: string; strengths?: string; improvements?: string; status?: string;
}
export interface ReviewResponse {
  id: number; appraisalId: number; employeeId: number; managerId: number; cycleId: number;
  performanceRating: number; comments: string; strengths?: string; improvements?: string;
  status: ReviewStatus; createdAt: string; updatedAt: string;
}
