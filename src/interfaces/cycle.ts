export interface AppraisalCycleRequest { name: string; startDate: string; endDate: string; active?: boolean; }
export interface AppraisalCycleResponse { id: number; name: string; startDate: string; endDate: string; active: boolean; createdAt: string; }
