import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Target, Star, User, Building2,
  RefreshCcw, ClipboardList, FileBarChart, ChevronLeft, ChevronRight, LogOut, UserCheck, BookOpen
} from 'lucide-react';

const employeeLinks = [
  { to: '/employee/guidelines', label: 'Guidelines', icon: BookOpen },
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/goals', label: 'My Goals', icon: Target },
  { to: '/employee/self-appraisal', label: 'Self Appraisal', icon: ClipboardList },
  { to: '/employee/reviews', label: 'My Reviews', icon: Star },
  // { to: '/employee/notifications', label: 'Notifications', icon: Bell },
];
const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/manager/team', label: 'Team Members', icon: Users },
  { to: '/manager/reviews', label: 'Pending Reviews', icon: ClipboardList },
  { to: '/manager/reports', label: 'Team Reports', icon: FileBarChart},
  { to: '/manager/goals', label: 'Goals Review', icon: Target },
  // { to: '/manager/cycles', label: 'Appraisal Cycles', icon: RefreshCcw },
  // { to: '/manager/notifications', label: 'Notifications', icon: Bell },
];
const hrLinks = [
  { to: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hr/employees', label: 'Employees', icon: Users },
  { to: '/hr/departments', label: 'Departments', icon: Building2 },
  { to: '/hr/cycles', label: 'Appraisal Cycles', icon: RefreshCcw },
  { to: '/hr/reviews', label: 'Review Management', icon: UserCheck },
  { to: '/hr/reports', label: 'Reports', icon: FileBarChart },
  // { to: '/hr/notifications', label: 'Notifications', icon: Bell },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isEmployee, isManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = isEmployee ? employeeLinks : isManager ? managerLinks : hrLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
  <aside
    className={`${
      collapsed ? 'w-20' : 'w-64'
    } min-h-screen bg-gradient-to-b from-white to-[#F4F8FF] border-r border-[#D6E4FF] flex flex-col transition-all duration-300 shrink-0`}
  >
    {/* Header */}
    <div className="px-4 py-5 border-b border-[#D6E4FF]">
      <div className="flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-extrabold text-[#0E4CB7]">
              Appraisal System
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {user?.role} PORTAL
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-2 rounded-xl hover:bg-[#E7F0FF] text-gray-500 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-3 space-y-2">
      {links.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to;

        return (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 ${
              active
                ? 'bg-[#0E4CB7] text-white shadow-md'
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Icon size={18} />

            {!collapsed && (
              <span className="text-sm font-medium">
                {label}
              </span>
            )}

            {active && !collapsed && (
              <div className="absolute right-3 h-2 w-2 rounded-full bg-white" />
            )}
          </button>
        );
      })}
    </nav>

    {/* Bottom Section */}
    <div className="p-3 border-t border-[#D6E4FF]">
      <div className="rounded-2xl bg-white shadow-sm border border-[#D6E4FF] p-2 space-y-1">
        <button
          onClick={() =>
            navigate(
              isEmployee
                ? '/employee/profile'
                : isManager
                ? '/manager/profile'
                : '/hr/profile'
            )
          }
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-600 hover:bg-[#F4F8FF] hover:text-[#0E4CB7] transition"
        >
          <User size={18} />
          {!collapsed && <span>Profile</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  </aside>
);
};
