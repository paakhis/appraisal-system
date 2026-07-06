import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';

export const AppLayout = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-[1200px] justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);
