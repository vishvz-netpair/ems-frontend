import { apiRequest } from "./api";

export type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  status?: "Active" | "Inactive";
  isDeleted?: boolean;
};

export async function fetchUsers(): Promise<UserItem[]> {
  return apiRequest<UserItem[]>("/api/users", "GET");
} 