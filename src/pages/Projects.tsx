import ProjectsAdmin from "./projects/projectsAdmin.tsx";
import MyProjects from "./projects/MyProjects.tsx";

const Projects = () => {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return null;

  if (user.role === "superadmin") {
    return <ProjectsAdmin />;
  }

  // employee
  return <MyProjects />;
};

export default Projects;