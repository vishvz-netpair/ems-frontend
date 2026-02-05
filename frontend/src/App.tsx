import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"

function App() {
  const user = {
    name: "Admin",
    role: "admin",
  }

  return (
    <Layout user={user}>
      <Dashboard />
    </Layout>
  )
}

export default App
