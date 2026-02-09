<<<<<<< HEAD
import UiDemo from "./pages/UiDemo";
=======
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
>>>>>>> 7ebfb7930f73326835c4b87ce8def36bf64c0edb

function App() {
  const user = {
    name: "Admin",
    role: "admin",
  }

  return (
<<<<<<< HEAD
    <>
      <UiDemo />
    </>
  );
=======
    <Layout user={user}>
      <Dashboard />
    </Layout>
  )
>>>>>>> 7ebfb7930f73326835c4b87ce8def36bf64c0edb
}

export default App
