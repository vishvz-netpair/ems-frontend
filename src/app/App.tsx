import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../features/auth/pages/Dashboard";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Login from "../features/auth/pages/Login";
import ResetPassword from "../features/auth/pages/ResetPassword";
import { DepartmentProvider } from "../features/department/context/department-context";
import DepartmentMaster from "../features/department/pages/DepartmentMaster";
import { DesignationProvider } from "../features/designation/context/designation-provider";
import DesignationMaster from "../features/designation/pages/DesignationMaster";
import AssetMaster from "../features/assets/pages/AssetMaster";
import Attendance from "../features/attendance/pages/Attendance";
import AttendanceManagementPage from "../features/attendance/pages/AttendanceManagementPage";
import AttendancePolicyPage from "../features/attendance/pages/AttendancePolicyPage";
import MyAttendancePage from "../features/attendance/pages/MyAttendancePage";
import { getSession, hasRequiredRole, type UserRole } from "../features/auth/services/auth";
import HolidayMaster from "../features/leaves/pages/HolidayMaster";
import LeaveCalendarPage from "../features/leaves/pages/LeaveCalendarPage";
import LeaveRequestsPage from "../features/leaves/pages/LeaveRequestsPage";
import Leaves from "../features/leaves/pages/Leaves";
import LeaveTypesPage from "../features/leaves/pages/LeaveTypesPage";
import ProjectDetails from "../features/projects/pages/ProjectDetails";
import Projects from "../features/projects/pages/Projects";
import MyTasksPage from "../features/tasks/pages/MyTasksPage";
import Users from "../features/users/pages/Users";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
};

function ProtectedRoute({ children, allowedRoles, redirectTo = "/" }: ProtectedRouteProps) {
  const { user, token } = getSession();

  if (!token || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  const role = user.role ?? "employee";
  if (!hasRequiredRole(role, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout
      user={{
        name: user.name || user.email,
        role,
      }}
    >
      {children}
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DepartmentProvider>
        <DesignationProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/department"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <DepartmentMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/designation"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <DesignationMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/assets"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AssetMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "employee"]}>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "employee"]}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute>
                  <MyTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <Leaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/types"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                  <LeaveTypesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/requests"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/calendar"
              element={
                <ProtectedRoute>
                  <LeaveCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/holidays"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <HolidayMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-attendance"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <MyAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/manage"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                  <AttendanceManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/policy"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                  <AttendancePolicyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DesignationProvider>
      </DepartmentProvider>
    </BrowserRouter>
  );
}

export default App;
