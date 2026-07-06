import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../interfaces/auth';

const authAxios = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await authAxios.post<LoginResponse>('/api/auth/login', data);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg: string =
        err.response?.data?.message ||
        err.response?.data ||
        '';
      if (
        err.response?.status === 500 &&
        typeof msg === 'string' &&
        (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('not found'))
      ) {
        throw new Error('INVALID_CREDENTIALS');
      }
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        throw new Error('BACKEND_DOWN');
      }
    }
    throw new Error('INVALID_CREDENTIALS');
  }
};