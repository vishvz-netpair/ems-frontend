import { apiRequest } from "../../../services/api";

export type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  status?: "Active" | "Inactive";
  department?: string;
  designation?: string;
};

export type UsersResponse = {
  items: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<UsersResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = (params.search ?? "").trim();

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (search) qs.set("search", search);

  return apiRequest<UsersResponse>(`/api/users?${qs.toString()}`);
}

export async function createUser(payload: {
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  departmentId: string;
  designationId: string;
}) {
  return apiRequest<{ id: string; message: string }>(
    `/api/users`,
    "POST",
    payload,
  );
}
export async function fetchActiveUsers() {
  return apiRequest<{
    items: {
      _id: string;
      name: string;
      email: string;
      role: string;
      status?: string;
    }[];
  }>("/api/users?status=Active&limit=1000");
}
export async function updateUserStatus(
  id: string,
  status: "Active" | "Inactive",
) {
  return apiRequest(`/api/users/${id}/status`, "PATCH", { status });
}
export async function updateUser(
  id: string,
  payload: {
    name: string;
    email: string;
    role: "superadmin" | "admin" | "employee";
    departmentId: string;
    designationId: string;
    status: "Active" | "Inactive";
  },
) {
  return apiRequest(`/api/users/${id}`, "PUT", payload);
}

export async function deleteUser(id: string) {
  return apiRequest(`/api/users/${id}`, "DELETE");
}
