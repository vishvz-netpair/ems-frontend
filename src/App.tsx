import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import UiDemo from "./pages/UiDemo"

function App() {
  // TEMP user (later this will come from login)
  const user = {
    name: "Admin",
    role: "admin",
  }

  return (
    <BrowserRouter>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ui-demo" element={<UiDemo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
