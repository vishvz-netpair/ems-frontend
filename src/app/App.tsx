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
import EmployeeAttendancePage from "../features/attendance/pages/EmployeeAttendancePage";
import AttendanceManagementPage from "../features/attendance/pages/AttendanceManagementPage";
import AttendancePolicyPage from "../features/attendance/pages/AttendancePolicyPage";
import MyAttendancePage from "../features/attendance/pages/MyAttendancePage";
import AnnouncementDetailsPage from "../features/communications/pages/AnnouncementDetailsPage";
import AnnouncementsPage from "../features/communications/pages/AnnouncementsPage";
import EventDetailsPage from "../features/communications/pages/EventDetailsPage";
import EventsPage from "../features/communications/pages/EventsPage";
import PoliciesPage from "../features/communications/pages/PoliciesPage";
import PolicyDetailsPage from "../features/communications/pages/PolicyDetailsPage";
import {
  ACCESS_RULES,
  getSession,
  hasRequiredRole,
  type UserRole,
} from "../features/auth/services/auth";
import HolidayMaster from "../features/leaves/pages/HolidayMaster";
import LeaveCalendarPage from "../features/leaves/pages/LeaveCalendarPage";
import LeaveRequestsPage from "../features/leaves/pages/LeaveRequestsPage";
import Leaves from "../features/leaves/pages/Leaves";
import LeaveTypesPage from "../features/leaves/pages/LeaveTypesPage";
import EmployeeLeaveDashboard from "../features/leaves/pages/EmployeeLeaveDashboard";
import ProjectDetails from "../features/projects/pages/ProjectDetails";
import Projects from "../features/projects/pages/Projects";
import MyTasksPage from "../features/tasks/pages/MyTasksPage";
import Users from "../features/users/pages/Users";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: readonly UserRole[];
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
              path="/communications/announcements"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communications/announcements/:announcementId"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <AnnouncementDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communications/policies"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <PoliciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communications/policies/:policyId"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <PolicyDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communications/events"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communications/events/:eventId"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.communicationsPage}>
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.usersPage}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/department"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.departmentMaster}>
                  <DepartmentMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/designation"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.designationMaster}>
                  <DesignationMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masters/assets"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.assetMaster}>
                  <AssetMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.projectsPage}>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.projectsPage}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.myTasksPage}>
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
                <ProtectedRoute allowedRoles={ACCESS_RULES.leaveTypes}>
                  <LeaveTypesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/requests"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.leaveRequests}>
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
              path="/leaves/my"
              element={
                <ProtectedRoute allowedRoles={["employee", "HR"]}>
                  <EmployeeLeaveDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/holidays"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.leaveHolidays}>
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
                <ProtectedRoute allowedRoles={["employee", "teamLeader", "HR"]}>
                  <MyAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/self"
              element={
                <ProtectedRoute allowedRoles={["employee", "teamLeader", "HR"]}>
                  <EmployeeAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/manage"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.attendanceManage}>
                  <AttendanceManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/policy"
              element={
                <ProtectedRoute allowedRoles={ACCESS_RULES.attendancePolicy}>
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



