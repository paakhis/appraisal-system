import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#F4F8FF] via-white to-[#E7F0FF] flex items-center justify-center">
    <Outlet />
  </div>
);
