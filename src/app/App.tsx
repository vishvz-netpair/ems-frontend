// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Layout from "../components/layout/Layout";
import Dashboard from "../features/auth/pages/Dashboard";
import DepartmentMaster from "../features/department/pages/DepartmentMaster";
import DesignationMaster from "../features/designation/pages/DesignationMaster";
import { DepartmentProvider } from "../features/department/context/department-context";
import { DesignationProvider } from "../features/designation/context/designation-provider";
import Projects from "../features/projects/pages/Projects";
import { getSession } from "../features/auth/services/auth";
import ProjectDetails from "../features/projects/pages/ProjectDetails";
import MyTasksPage from "../features/tasks/pages/MyTasksPage";
import AssetMaster from "../features/assets/pages/AssetMaster";
import Users from "../features/users/pages/Users";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, token } = getSession();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // convert to Layout required shape
  const safeUser = {
    name: user.email,
    role: user.role ?? "employee",
  };

  return <Layout user={safeUser}>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <DepartmentProvider>
        <DesignationProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            {/* Protected */}
            <Route
              path="/user"
              element={
                <RequireAuth>
                  <Users />
                </RequireAuth>
              }
            />

            <Route
              path="/masters/department"
              element={
                <RequireAuth>
                  <DepartmentMaster />
                </RequireAuth>
              }
            />

            <Route
              path="/masters/designation"
              element={
                <RequireAuth>
                  <DesignationMaster />
                </RequireAuth>
              }
            />

            <Route
              path="/projects"
              element={
                <RequireAuth>
                  <Projects />
                </RequireAuth>
              }
            />
            <Route
              path="/masters/assets"
              element={
                <RequireAuth>
                  <AssetMaster />
                </RequireAuth>
              }
            />

            {/* ✅ Project detail page */}
            <Route
              path="/projects/:projectId"
              element={
                <RequireAuth>
                  <ProjectDetails />
                </RequireAuth>
              }
            />

            {/* ✅ My Tasks */}
            <Route
              path="/my-tasks"
              element={
                <RequireAuth>
                  <MyTasksPage />
                </RequireAuth>
              }
            />
          </Routes>
        </DesignationProvider>
      </DepartmentProvider>
    </BrowserRouter>
  );
}

export default App;
