import { apiRequest } from "./api";

export type TaskStatus = "Pending" | "In Progress" | "In Review" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type TaskUser = {
  _id: string;
  name: string;
  email: string;
};

export type TaskItem = {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo: TaskUser;
  assignedBy?: TaskUser;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  estimatedHours?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectTasksResponse = {
  items: TaskItem[];
  summary: {
    totalTasks: number;
    completedTasks: number;
    progress: number;
  };
};

export type MyTaskItem = {
  _id: string;
  projectId: { _id: string; name: string; status: string };
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  estimatedHours?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTaskPayload = {
  projectId: string;
  title: string;
  description?: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  estimatedHours?: number;
};

export type UpdateTaskPayload = Partial<{
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate: string | null; // YYYY-MM-DD or null
  estimatedHours: number | null;
}>;

export async function createTask(payload: CreateTaskPayload) {
  return apiRequest<{ success: boolean; message: string; taskId: string }>(
    "/api/tasks",
    "POST",
    payload,
  );
}

export async function getTasksByProject(projectId: string) {
  return apiRequest<ProjectTasksResponse>(`/api/tasks/project/${projectId}`, "GET");
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return apiRequest<{ task: TaskItem }>(`/api/tasks/${taskId}`, "PUT", payload);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  return apiRequest<{ task: TaskItem }>(`/api/tasks/${taskId}/status`, "PUT", { status });
}

export async function deleteTask(taskId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/tasks/${taskId}`, "DELETE");
}

export async function getMyTasks() {
  return apiRequest<{ items: MyTaskItem[] }>("/api/tasks/my", "GET");
}