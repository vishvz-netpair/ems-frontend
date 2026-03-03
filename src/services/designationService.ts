import { apiRequest } from "./api";
//import type { ApiResponse } from "../services/api";

export type DesignationItem = {
  id: string;
  name: string;
  departmentId: string | null;
  department: string;
  status: "Active" | "Inactive";
};

export type DesignationListResponse = {
  items: DesignationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function listDesignations(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = (params.search ?? "").trim();

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (search) qs.set("search", search);

  return apiRequest<DesignationListResponse>(
    `/api/designations?${qs.toString()}`
  );
}

export async function createDesignation(payload: {
  name: string;
  departmentId: string;
  status: "Active" | "Inactive";
}) {
  return apiRequest(`/api/designations`, "POST", payload);
}

export async function updateDesignation(
  id: string,
  payload: {
    name: string;
    departmentId: string;
    status: "Active" | "Inactive";
  }
) {
  return apiRequest(`/api/designations/${id}`, "PUT", payload);
}

export async function deleteDesignation(id: string) {
  return apiRequest(`/api/designations/${id}`, "DELETE");
}