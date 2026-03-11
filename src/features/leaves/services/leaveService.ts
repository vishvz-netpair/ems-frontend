import { apiRequest } from "../../../services/api";

export type LeaveTypeItem = {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  totalAllocation: number;
  allocationPeriod: "yearly" | "monthly";
  carryForwardEnabled: boolean;
  maxCarryForwardLimit: number;
  accrualEnabled: boolean;
  accrualAmount: number;
  accrualFrequency: "monthly";
  approvalWorkflowType: "single_level" | "two_level";
  maxDaysPerRequest: number;
  minNoticeDays: number;
  allowPastDates: boolean;
  requiresAttachment: boolean;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
};

export type LeaveBalanceItem = {
  cycleKey: string;
  year?: number;
  month?: number | null;
  totalAllocated: number;
  accrued: number;
  carriedForward: number;
  used: number;
  pending: number;
  remaining: number;
  leaveType: LeaveTypeItem;
};

export type LeaveApprovalHistoryItem = {
  level: number;
  action: "Submitted" | "Approved" | "Rejected" | "Cancelled";
  role: "superadmin" | "admin" | "employee";
  remarks: string;
  actedAt: string;
  by: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type LeaveRequestItem = {
  id: string;
  employee: {
    id: string;
    name: string;
    email: string;
  } | null;
  leaveType: {
    id: string | null;
    name: string;
    code: string;
    color: string;
  };
  fromDate: string;
  toDate: string;
  dayUnit: "FULL" | "HALF";
  totalDays: number;
  reason: string;
  attachment: {
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
  } | null;
  status: "Pending" | "Level 1 Approved" | "Approved" | "Rejected" | "Cancelled";
  currentApprovalLevel: number;
  approvalWorkflowType: "single_level" | "two_level";
  balanceCycleKey: string;
  approvalHistory: LeaveApprovalHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
  cancelledAt?: string | null;
  rejectionReason?: string;
};

export type LeaveEmployeeOption = {
  id: string;
  name: string;
  email: string;
};

export type LeaveCalendarItem = {
  id: string;
  title: string;
  employeeName: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  color: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  status: LeaveRequestItem["status"];
};

export type LeaveSummaryResponse = {
  summary: Record<string, number>;
  balances?: LeaveBalanceItem[];
  recentRequests?: LeaveRequestItem[];
  topLeaveTypes?: Array<{ leaveTypeName: string; count: number }>;
};

export type LeaveTypePayload = Omit<LeaveTypeItem, "id" | "createdAt" | "updatedAt">;

export async function getLeaveSummary() {
  return apiRequest<LeaveSummaryResponse>("/api/leaves/dashboard/summary", "GET");
}

export async function listLeaveTypes() {
  return apiRequest<{ items: LeaveTypeItem[] }>("/api/leaves/types", "GET");
}

export async function listActiveLeaveTypes() {
  return apiRequest<{ items: LeaveTypeItem[] }>("/api/leaves/types/active", "GET");
}

export async function createLeaveType(payload: LeaveTypePayload) {
  return apiRequest<LeaveTypeItem>("/api/leaves/types", "POST", payload);
}

export async function updateLeaveType(id: string, payload: LeaveTypePayload) {
  return apiRequest<LeaveTypeItem>(`/api/leaves/types/${id}`, "PUT", payload);
}

export async function deleteLeaveType(id: string) {
  return apiRequest<{ message: string }>(`/api/leaves/types/${id}`, "DELETE");
}

export async function getMyLeaveBalances() {
  return apiRequest<{ items: LeaveBalanceItem[] }>("/api/leaves/balances/me", "GET");
}

export async function getLeaveEmployees() {
  return apiRequest<{ items: LeaveEmployeeOption[] }>("/api/leaves/employees/options", "GET");
}

export async function applyLeave(payload: FormData) {
  return apiRequest<{ id: string }>("/api/leaves/requests/apply", "POST", payload);
}

export async function listMyLeaveRequests(params: {
  page: number;
  limit: number;
  status?: string;
  leaveTypeId?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    status: params.status || "all",
    leaveTypeId: params.leaveTypeId || "",
    fromDate: params.fromDate || "",
    toDate: params.toDate || "",
  });

  return apiRequest<{
    items: LeaveRequestItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/api/leaves/requests/my?${qs.toString()}`, "GET");
}

export async function listLeaveRequests(params: {
  page: number;
  limit: number;
  status?: string;
  leaveTypeId?: string;
  employeeId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    status: params.status || "all",
    leaveTypeId: params.leaveTypeId || "",
    employeeId: params.employeeId || "",
    fromDate: params.fromDate || "",
    toDate: params.toDate || "",
    search: params.search || "",
  });

  return apiRequest<{
    items: LeaveRequestItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/api/leaves/requests?${qs.toString()}`, "GET");
}

export async function getLeaveRequestById(id: string) {
  return apiRequest<LeaveRequestItem>(`/api/leaves/requests/${id}`, "GET");
}

export async function takeLeaveAction(id: string, payload: { action: "approve" | "reject"; remarks: string }) {
  return apiRequest<{ message: string }>(`/api/leaves/requests/${id}/action`, "POST", payload);
}

export async function cancelLeaveRequest(id: string, remarks = "") {
  return apiRequest<{ message: string }>(`/api/leaves/requests/${id}/cancel`, "POST", { remarks });
}

export async function getLeaveCalendar(params: {
  month: number;
  year: number;
  employeeId?: string;
  status?: string;
}) {
  const qs = new URLSearchParams({
    month: String(params.month),
    year: String(params.year),
    employeeId: params.employeeId || "",
    status: params.status || "all",
  });

  return apiRequest<{ items: LeaveCalendarItem[] }>(`/api/leaves/calendar?${qs.toString()}`, "GET");
}

export async function runLeaveAutomation(runDate?: string) {
  return apiRequest<{
    runDate: string;
    carryForward: Record<string, number | string>;
    accrual: Record<string, number | string>;
  }>("/api/leaves/automation/process", "POST", runDate ? { runDate } : {});
}
