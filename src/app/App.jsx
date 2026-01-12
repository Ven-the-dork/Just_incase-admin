import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DynamicTitle from "../DynamicTitle";

import Dashboard from "../features/dashboard/pages/DashboardAdmin";
import EmployeeManagement from "../features/employees/pages/EmployeeManagement";
import LeaveManagement from "../features/leave_management/pages/LeaveManagement";
import AdminLogin from "../features/auth/pages/Adminloginpage";
import AuditLogs from "../features/audit_logs/pages/AuditLogs";
import DashboardUser from "../features/dashboard/pages/DashboardUser";
import Applyforleave from "../features/leave_management/pages/UserApplyForLeave";
import UserProfile from "../features/profile/pages/UserProfile"; 
import ProtectedRoute from "../ProtectedRoute";
import PayrollManagement from "../features/payroll_management/pages/PayrollManagement";
import TimeTracking from "../features/time_tracking/pages/TimeTracking";

function App() {
  return (
    <div className="app-root">
    <Router>
      <DynamicTitle />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AdminLogin />} />
        {/* Admin-only Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <LeaveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PayrollManagement"
          element={
            <ProtectedRoute requiredRole="admin">
              <PayrollManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-tracking"
          element={
            <ProtectedRoute requiredRole="admin">
              <TimeTracking />
            </ProtectedRoute>
          }
        />
        {/* User-only Routes */}
        <Route
          path="/dashboard_user"
          element={
            <ProtectedRoute requiredRole="user">
              <DashboardUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applyforleave"
          element={
            <ProtectedRoute requiredRole="user">
              <Applyforleave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
