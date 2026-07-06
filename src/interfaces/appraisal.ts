export type AppraisalStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
export interface AppraisalRequest { employeeId: number; managerId: number; cycleId: number; }
export interface AppraisalResponse {
  id: number; employeeId: number; employeeName: string; managerId: number; managerName: string;
  cycleId: number; cycleName: string; selfRating?: number; managerRating?: number;
  finalComment?: string; status: AppraisalStatus; createdAt: string; updatedAt: string;
}
