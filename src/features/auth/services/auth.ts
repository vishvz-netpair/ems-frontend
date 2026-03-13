export type UserRole = "superadmin" | "admin" | "employee";

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

export function hasRequiredRole(role: UserRole | undefined, allowedRoles?: UserRole[]) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;
  return allowedRoles.includes(role);
}
