<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UiDemo from "./pages/UiDemo";
import DepartmentMaster from "./pages/DepartmentMaster";
import DesignationMaster from "./pages/DesignationMaster";
import { DepartmentProvider } from "./context/DepartmentContext";
import { DesignationProvider } from "./context/DesignationContext";
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import UiDemo from "./pages/UiDemo"
import DepartmentMaster from "./pages/master/DepartmentMaster"
import DesignationMaster from "./pages/master/DesignationMaster"
import { DepartmentProvider } from "./context/department-context";
import { DesignationProvider } from "./context/designation-provider";
>>>>>>> da655b4e7b1764899eb4aa20382a3477c6f51acf

function App() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <BrowserRouter>
      <DepartmentProvider>
        <DesignationProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Layout user={user}>
                    <Dashboard />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/ui-demo"
              element={
                user ? (
                  <Layout user={user}>
                    <UiDemo />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/masters/department"
              element={
                user ? (
                  <Layout user={user}>
                    <DepartmentMaster />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/masters/designation"
              element={
                user ? (
                  <Layout user={user}>
                    <DesignationMaster />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

          </Routes>
        </DesignationProvider>
      </DepartmentProvider>
    </BrowserRouter>
  );
}

export default App;