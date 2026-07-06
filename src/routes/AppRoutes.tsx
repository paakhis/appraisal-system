import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Employee
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { SelfAppraisalPage } from '../pages/employee/SelfAppraisalPage';
import  GuidelinesPage  from "../pages/employee/GuidelinesPage";
import { GoalsPage } from '../pages/employee/GoalsPage';
import { ReviewsPage } from '../pages/employee/ReviewsPage';
import { NotificationsPage } from '../pages/employee/NotificationsPage';
import { ProfilePage } from '../pages/employee/ProfilePage';

// Manager
import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { TeamPage } from '../pages/manager/TeamPage';
import { PendingReviewsPage } from '../pages/manager/PendingReviewsPage';
import { GoalsReviewPage } from '../pages/manager/GoalsReviewPage';
import { ManagerCyclesPage } from '../pages/manager/CyclesPage';
import { TeamReportsPage } from '../pages/manager/TeamReportsPage';
// HR
import { HRDashboard } from '../pages/hr/HRDashboard';
import { EmployeesPage } from '../pages/hr/EmployeesPage';
import { DepartmentsPage } from '../pages/hr/DepartmentsPage';
import { CyclesPage } from '../pages/hr/CyclesPage';
import { ReviewManagementPage } from '../pages/hr/ReviewManagementPage';
import { ReportsPage } from '../pages/hr/ReportsPage';
import { AppraisalsPage } from '../pages/hr/AppraisalsPage';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes: Record<string, string> = {
    EMPLOYEE: '/employee/guidelines',
    MANAGER: '/manager/dashboard',
    HR: '/hr/dashboard',
  };
  return <Navigate to={routes[user.role] || '/login'} replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    {/* Auth */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    {/* Employee */}
    <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><AppLayout /></ProtectedRoute>}>
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/self-appraisal" element={<SelfAppraisalPage />} />
      <Route path="/employee/guidelines" element={<GuidelinesPage />} />
      <Route path="/employee/goals" element={<GoalsPage />} />
      <Route path="/employee/reviews" element={<ReviewsPage />} />
      <Route path="/employee/notifications" element={<NotificationsPage />} />
      <Route path="/employee/profile" element={<ProfilePage />} />
    </Route>

    {/* Manager */}
    <Route element={<ProtectedRoute allowedRoles={['MANAGER']}><AppLayout /></ProtectedRoute>}>
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/manager/team" element={<TeamPage />} />
      <Route path="/manager/reviews" element={<PendingReviewsPage />} />
      <Route path="/manager/goals" element={<GoalsReviewPage />} />
        <Route path="/manager/reports" element={<TeamReportsPage />}/>
      <Route path="/manager/cycles" element={<ManagerCyclesPage />} />
      <Route path="/manager/notifications" element={<NotificationsPage />} />
      <Route path="/manager/profile" element={<ProfilePage />} />
    </Route>

    {/* HR */}
    <Route element={<ProtectedRoute allowedRoles={['HR']}><AppLayout /></ProtectedRoute>}>
      <Route path="/hr/dashboard" element={<HRDashboard />} />
      <Route path="/hr/employees" element={<EmployeesPage />} />
      <Route path="/hr/departments" element={<DepartmentsPage />} />
      <Route path="/hr/cycles" element={<CyclesPage />} />
      <Route path="/hr/appraisals" element={<AppraisalsPage />} />
      <Route path="/hr/reviews" element={<ReviewManagementPage />} />
      <Route path="/hr/reports" element={<ReportsPage />} />
      <Route path="/hr/notifications" element={<NotificationsPage />} />
      <Route path="/hr/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
