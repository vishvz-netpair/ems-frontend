import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import UiDemo from "./pages/UiDemo"
import DepartmentMaster from "./pages/master/DepartmentMaster"
import DesignationMaster from "./pages/master/DesignationMaster"
import { DepartmentProvider } from "./context/department-context";
import { DesignationProvider } from "./context/designation-provider";



function App() {
  // TEMP user (later this will come from login)
  const user = {
    name: "Admin",
    role: "admin",
  }

  return (
    <BrowserRouter>
    <DepartmentProvider>
      <DesignationProvider>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ui-demo" element={<UiDemo />} />
          <Route path="/masters/department" element={<DepartmentMaster/>}/>
          <Route path="/masters/designation" element={<DesignationMaster/>}/>
        </Routes>
      </Layout>
      </DesignationProvider>
      </DepartmentProvider>
    </BrowserRouter>
  )
}

export default App
