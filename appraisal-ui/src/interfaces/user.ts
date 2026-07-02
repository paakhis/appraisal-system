export interface UserRequest {
  name: string; email: string; password?: string; roles: string;
  designation: string; departmentId: number; managerId?: number;
}
export interface UserResponse {
  id: number; name: string; email: string; roles: string; designation: string;
  departmentId: number; departmentName: string; managerId?: number; managerName?: string;
  createdAt: string; updatedAt: string;
}
