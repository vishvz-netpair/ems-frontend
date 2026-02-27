// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UiDemo from "./pages/UiDemo";
import DepartmentMaster from "./pages/master/DepartmentMaster";
import DesignationMaster from "./pages/master/DesignationMaster";
import { DepartmentProvider } from "./context/department-context";
import { DesignationProvider } from "./context/designation-provider";
import Projects from "./pages/Projects";
import { getSession } from "./services/auth";
import ProjectDetails from "./pages/projects/ProjectDetails";
import MyTasksPage from "./pages/tasks/MyTasksPage";
import AssetMaster from "./pages/master/AssetMaster";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, token } = getSession();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // convert to Layout required shape
  const safeUser = {
    name: user.username,
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
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            <Route
              path="/ui-demo"
              element={
                <RequireAuth>
                  <UiDemo />
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
