// src/services/auth.ts

export type SessionUser = {
  username: string;
  role?: "superadmin" | "admin" | "employee";
  id?: string;
};

export function saveSession(payload: { token: string; user: SessionUser }) {
  localStorage.setItem("token", payload.token);          // ✅ IMPORTANT
  localStorage.setItem("user", JSON.stringify(payload.user)); // ✅ IMPORTANT
}

export function getSession() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  const user: SessionUser | null = userRaw ? JSON.parse(userRaw) : null;

  return { token, user };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}