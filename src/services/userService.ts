import { apiRequest } from "./api";

export type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  status?: "Active" | "Inactive";
  isDeleted?: boolean;
};
type UsersResponse = {
  items: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export async function fetchUsers(page = 1, limit = 10): Promise<UsersResponse> {
  return apiRequest<UsersResponse>(`/api/users?page=${page}&limit=${limit}`);
}