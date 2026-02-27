import { apiRequest } from "./api";

export type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  status?: "Active" | "Inactive";
  isDeleted?: boolean;
};

export type UsersResponse = {
  items: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchUsersParams = Partial<{
  page: number;
  limit: number;
  role: "superadmin" | "admin" | "employee";
  status: "Active" | "Inactive";
  q: string;
}>;

export async function fetchUsers(
  params: FetchUsersParams = {},
): Promise<UsersResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  if (params.role) qs.set("role", params.role);

  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);

  return apiRequest<UsersResponse>(`/api/users?${qs.toString()}`, "GET");
}

export async function fetchActiveUsers(page = 1, limit = 50, q?: string) {
  return fetchUsers({ page, limit, status: "Active", q });
}
