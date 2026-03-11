import { getSession } from "../../auth/services/auth";
import AdminLeaveDashboard from "./AdminLeaveDashboard";
import EmployeeLeaveDashboard from "./EmployeeLeaveDashboard";

export default function Leaves() {
  const { user } = getSession();

  if (!user) return null;
  if (user.role === "employee") return <EmployeeLeaveDashboard />;

  return <AdminLeaveDashboard />;
}
