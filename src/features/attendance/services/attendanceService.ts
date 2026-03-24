import { apiRequest } from "../../../services/api";

export type AttendanceStatus =
  | "PRESENT"
  | "HALF_DAY"
  | "ABSENT"
  | "LEAVE"
  | "HOLIDAY"
  | "WEEK_OFF"
  | "MISSED_PUNCH"
  | "HALF_DAY_LEAVE_PRESENT";

export type AttendancePolicy = {
  id: string;
  officeStartTime: string;
  officeEndTime: string;
  graceMinutes: number;
  halfDayMinutes: number;
  fullDayMinutes: number;
  weeklyOffs: number[];
  multiplePunchAllowed: boolean;
  enableHolidayIntegration: boolean;
  enableLeaveIntegration: boolean;
  updatedAt?: string;
};

export type AttendancePunchItem = {
  _id?: string;
  id?: string;
  employeeId: string;
  date: string;
  dateKey: string;
  punchTime: string;
  punchType: "IN" | "OUT";
  source: "web" | "manual";
  remarks: string;
  createdAt?: string;
};

export type AttendanceDailySummary = {
  _id?: string;
  id?: string;
  employeeId:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        department?: { _id?: string; name?: string } | string | null;
        designation?: { _id?: string; name?: string } | string | null;
      };
  date: string;
  dateKey: string;
  year: number;
  month: number;
  totalWorkMinutes: number;
  firstIn?: string | null;
  lastOut?: string | null;
  status: AttendanceStatus;
  lateMinutes: number;
  isHalfDayLeave: boolean;
  leaveId?: string | null | { _id?: string; dayUnit?: "FULL" | "HALF"; status?: string };
  holidayId?: string | null | { _id?: string; name?: string; date?: string };
  weeklyOffApplied: boolean;
  remarks: string;
  missedPunch: boolean;
  punchCount: number;
};

export type AttendanceDayResponse = {
  summary: AttendanceDailySummary | null;
  punches: AttendancePunchItem[];
};

export type AttendanceMonthlyResponse = {
  items: AttendanceDailySummary[];
  summary: Record<string, number>;
};

export type AttendanceRecordListResponse = {
  items: AttendanceDailySummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AttendanceDashboardResponse = {
  totalRecords: number;
  summary: Record<string, number>;
};

export type AttendanceEmployeeOption = {
  id: string;
  name: string;
  email: string;
  department?: string | null;
  designation?: string | null;
};

export type AttendanceHolidayItem = {
  id: string;
  name: string;
  date: string;
  dateKey: string;
  description: string;
  scope: string;
  isActive: boolean;
};

export type AttendancePolicyPayload = Omit<AttendancePolicy, "id" | "updatedAt">;

const ATTENDANCE_DAY_UPDATED_EVENT = "attendance-day-updated";

type AttendanceDayUpdatedDetail = {
  dayData: AttendanceDayResponse;
};

export const NON_WORKING_ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "LEAVE",
  "HOLIDAY",
  "WEEK_OFF"
];

export function publishAttendanceDayUpdate(dayData: AttendanceDayResponse) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<AttendanceDayUpdatedDetail>(ATTENDANCE_DAY_UPDATED_EVENT, {
      detail: { dayData }
    })
  );
}

export function subscribeAttendanceDayUpdate(listener: (dayData: AttendanceDayResponse) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<AttendanceDayUpdatedDetail>;
    if (customEvent.detail?.dayData) {
      listener(customEvent.detail.dayData);
    }
  };

  window.addEventListener(ATTENDANCE_DAY_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(ATTENDANCE_DAY_UPDATED_EVENT, handler);
  };
}

export async function getAttendancePolicy() {
  return apiRequest<AttendancePolicy>("/api/attendance/policy", "GET");
}

export async function updateAttendancePolicy(payload: AttendancePolicyPayload) {
  return apiRequest<AttendancePolicy>("/api/attendance/policy", "PUT", payload);
}

export async function addAttendancePunch(payload: {
  employeeId?: string;
  punchTime?: string;
  punchType: "IN" | "OUT";
  source?: "web" | "manual";
  remarks?: string;
}) {
  return apiRequest<AttendancePunchItem>("/api/attendance/punches", "POST", payload);
}

export async function getMyDailyAttendance(date?: string) {
  const qs = new URLSearchParams();
  if (date) qs.set("date", date);
  return apiRequest<AttendanceDayResponse>(
    `/api/attendance/me/daily${qs.toString() ? `?${qs.toString()}` : ""}`,
    "GET"
  );
}

export async function getMyMonthlyAttendance(params: { month: number; year: number }) {
  const qs = new URLSearchParams({
    month: String(params.month),
    year: String(params.year)
  });

  return apiRequest<AttendanceMonthlyResponse>(`/api/attendance/me/monthly?${qs.toString()}`, "GET");
}

export async function getAttendanceEmployees() {
  return apiRequest<{ items: AttendanceEmployeeOption[] }>("/api/attendance/employees/options", "GET");
}

export async function listAttendanceRecords(params: {
  employeeId?: string;
  departmentId?: string;
  month?: number;
  year?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams({
    employeeId: params.employeeId || "",
    departmentId: params.departmentId || "",
    month: params.month ? String(params.month) : "",
    year: params.year ? String(params.year) : "",
    status: params.status || "all",
    fromDate: params.fromDate || "",
    toDate: params.toDate || "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10)
  });

  return apiRequest<AttendanceRecordListResponse>(`/api/attendance/records?${qs.toString()}`, "GET");
}

export async function getAttendanceDashboard(params: {
  employeeId?: string;
  departmentId?: string;
  month?: number;
  year?: number;
  fromDate?: string;
  toDate?: string;
}) {
  const qs = new URLSearchParams({
    employeeId: params.employeeId || "",
    departmentId: params.departmentId || "",
    month: params.month ? String(params.month) : "",
    year: params.year ? String(params.year) : "",
    fromDate: params.fromDate || "",
    toDate: params.toDate || "",
    status: "all",
    page: "1",
    limit: "31"
  });

  return apiRequest<AttendanceDashboardResponse>(`/api/attendance/dashboard/summary?${qs.toString()}`, "GET");
}

export async function recomputeAttendanceRange(payload: {
  employeeId?: string;
  fromDate: string;
  toDate: string;
}) {
  return apiRequest<{
    employeesProcessed: number;
    attendanceDaysProcessed: number;
  }>("/api/attendance/recompute/range", "POST", payload);
}

export async function recomputeAttendanceDay(payload: {
  employeeId: string;
  date: string;
}) {
  return apiRequest<{
    employeeId: string;
    dateKey: string;
    status: AttendanceStatus;
  }>("/api/attendance/recompute/day", "POST", payload);
}

export async function listAttendanceHolidays(params?: { month?: number; year?: number }) {
  const qs = new URLSearchParams({
    month: params?.month ? String(params.month) : "",
    year: params?.year ? String(params.year) : ""
  });

  return apiRequest<{ items: AttendanceHolidayItem[] }>(`/api/attendance/holidays?${qs.toString()}`, "GET");
}
