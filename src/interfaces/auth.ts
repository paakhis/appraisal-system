export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { id: number; name: string; email: string; role: string; token: string; }
export type UserRole = 'HR' | 'MANAGER' | 'EMPLOYEE';
