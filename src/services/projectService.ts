import { apiRequest } from "./api";

export type ProjectStatus = "active" | "pending";

export type ProjectEmployee = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type ProjectItem = {
  _id: string;
  name: string;
  description: string;
  timeLimit: string;
  startDate: string;
  status: ProjectStatus;
  employees: ProjectEmployee[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectListResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Array<{
    _id: string;
    name: string;
    startDate: string;
    timeLimit: string;
    status: ProjectStatus;
    employees: ProjectEmployee[];
    createdAt?: string;
  }>;
};

export type ProjectPayload = {
  name: string;
  description: string;
  timeLimit: string;
  startDate: string; // "YYYY-MM-DD"
  status: ProjectStatus;
  employees: string[]; // user ids
};

export async function createProject(payload: ProjectPayload) {
  return apiRequest<{ message: string; projectId: string }>(
    "/api/projects",
    "POST",
    payload
  );
}

export async function listProjects(params: { page: number; limit: number }) {
  return apiRequest<ProjectListResponse>(
    `/api/projects?page=${params.page}&limit=${params.limit}`,
    "GET"
  );
}

export async function getProjectById(id: string) {
  return apiRequest<ProjectItem>(`/api/projects/${id}`, "GET");
}
export async function getProjects(page = 1, limit = 10) {
  return apiRequest<{
    items: ProjectItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/api/projects?page=${page}&limit=${limit}`);
}
export async function updateProject(id: string, payload: ProjectPayload) {
  return apiRequest<{ message: string; project: ProjectItem }>(
    `/api/projects/${id}`,
    "PUT",
    payload
  );
}

export async function softDeleteProject(id: string) {
  return apiRequest<{ message: string }>(`/api/projects/${id}`, "DELETE");
}

export async function myProjects() {
  return apiRequest<{ items: ProjectItem[] }>(`/api/projects/my`, "GET");
}