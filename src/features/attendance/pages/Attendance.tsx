import { getSession } from "../../auth/services/auth";
import AdminAttendanceOverview from "./AdminAttendanceOverview";
import EmployeeAttendancePage from "./EmployeeAttendancePage";

export default function Attendance() {
  const { user } = getSession();

  if (!user) return null;
  if (user.role === "employee") return <EmployeeAttendancePage />;

  return <AdminAttendanceOverview />;
}
