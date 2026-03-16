export type UserRole =
  | "superadmin"
  | "admin"
  | "employee"
  | "HR"
  | "teamLeader";

export const ACCESS_RULES = {
  usersPage: ["superadmin", "HR"],
  usersManage: ["superadmin"],
  projectsPage: ["superadmin", "employee", "HR", "teamLeader"],
  projectManage: ["superadmin", "admin", "teamLeader"],
  myTasksPage: ["superadmin", "admin", "employee", "teamLeader"],
  attendancePage: ["superadmin", "admin", "employee", "HR", "teamLeader"],
  attendanceManage: ["superadmin", "admin", "HR"],
  attendancePolicy: ["superadmin", "admin", "HR"],
  leavesPage: ["superadmin", "admin", "employee", "HR", "teamLeader"],
  leaveTypes: ["superadmin", "admin", "HR"],
  leaveRequests: ["superadmin", "admin", "HR", "teamLeader"],
  leaveCalendar: ["superadmin", "admin", "employee", "HR", "teamLeader"],
  leaveHolidays: ["superadmin", "HR"],
  departmentMaster: ["superadmin", "HR"],
  designationMaster: ["superadmin", "HR"],
  assetMaster: ["superadmin", "HR"],
} as const satisfies Record<string, UserRole[]>;

export type SessionUser = {
  id?: string;
  name?: string;
  email: string;
  role?: UserRole;
};

export function saveSession(payload: { token: string; user: SessionUser }) {
  localStorage.setItem("token", payload.token);
  localStorage.setItem("user", JSON.stringify(payload.user));
}

export function getSession() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: SessionUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as SessionUser;
    } catch {
      localStorage.removeItem("user");
    }
  }

  return { token, user };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function hasRequiredRole(
  role: UserRole | undefined,
  allowedRoles?: readonly UserRole[],
) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function hasAccess(
  role: UserRole | undefined,
  accessKey: keyof typeof ACCESS_RULES,
) {
  return hasRequiredRole(role, ACCESS_RULES[accessKey]);
}
