import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import DatePicker from "../../../components/ui/DatePicker";
import Loader from "../../../components/ui/Loader";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import AttendanceStatusBadge from "../components/AttendanceStatusBadge";
import {
  getAttendanceDashboard,
  getAttendanceEmployees,
  listAttendanceRecords,
  recomputeAttendanceDay,
  recomputeAttendanceRange,
  type AttendanceDailySummary
} from "../services/attendanceService";
import { listDepartments, type DepartmentItem } from "../../department/services/departmentService";
import { formatDate } from "../../../utils/date";
import { getSession } from "../../auth/services/auth";

type Row = AttendanceDailySummary & { id: string };

const monthOptions = [
  { label: "All Months", value: "" },
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" }
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Present", value: "PRESENT" },
  { label: "Half Day", value: "HALF_DAY" },
  { label: "Absent", value: "ABSENT" },
  { label: "Leave", value: "LEAVE" },
  { label: "Holiday", value: "HOLIDAY" },
  { label: "Week Off", value: "WEEK_OFF" },
  { label: "Missed Punch", value: "MISSED_PUNCH" },
  { label: "Half Day Leave + Present", value: "HALF_DAY_LEAVE_PRESENT" }
];

function formatTime(value?: string | null) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getEmployeeLabel(employee: Row["employeeId"]) {
  if (!employee || typeof employee === "string") return "--";
  return employee.name || employee.email || "--";
}

function getDepartmentLabel(employee: Row["employeeId"]) {
  if (!employee || typeof employee === "string") return "--";
  const department = employee.department;
  if (!department) return "--";
  if (typeof department === "string") return department;
  return department.name || "--";
}

export default function AttendanceManagementPage() {
  const { user } = getSession();
  const navigate = useNavigate();
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Array<{ id: string; name: string; departmentId: string }>>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [items, setItems] = useState<AttendanceDailySummary[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [employeeId, setEmployeeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(31);
  const [total, setTotal] = useState(0);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, index) => {
      const value = String(currentYear - 2 + index);
      return { label: value, value };
    });
  }, []);

  const loadMeta = async () => {
    try {
      const [employeeRes, departmentRes] = await Promise.all([
        getAttendanceEmployees(),
        listDepartments({ page: 1, limit: 100 })
      ]);

      setEmployees(
        (employeeRes.items || []).map((item) => ({
          id: item.id,
          name: item.name,
          departmentId: item.department || ""
        }))
      );
      setDepartments(departmentRes.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load filters");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordRes, summaryRes] = await Promise.all([
        listAttendanceRecords({
          employeeId,
          departmentId,
          month: month ? Number(month) : undefined,
          year: year ? Number(year) : undefined,
          status,
          fromDate,
          toDate,
          page,
          limit
        }),
        getAttendanceDashboard({
          employeeId,
          departmentId,
          month: month ? Number(month) : undefined,
          year: year ? Number(year) : undefined,
          fromDate,
          toDate
        })
      ]);

      setItems(recordRes.items || []);
      setTotal(recordRes.total || 0);
      setSummary(summaryRes.summary || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load attendance management");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadData();
  }, [employeeId, departmentId, month, year, status, fromDate, toDate, page, limit]);

  const filteredEmployees = useMemo(() => {
    if (!departmentId) return employees;
    return employees.filter((item) => item.departmentId === departmentId);
  }, [departmentId, employees]);

  useEffect(() => {
    if (!departmentId) return;
    if (employeeId && !filteredEmployees.some((item) => item.id === employeeId)) {
      setEmployeeId("");
      setPage(1);
    }
  }, [departmentId, employeeId, filteredEmployees]);

  const cards = [
    { label: "Present", value: summary.PRESENT ?? 0, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Absent", value: summary.ABSENT ?? 0, tone: "bg-rose-50 text-rose-700" },
    { label: "Leave", value: summary.LEAVE ?? 0, tone: "bg-sky-50 text-sky-700" },
    { label: "Holiday", value: summary.HOLIDAY ?? 0, tone: "bg-violet-50 text-violet-700" },
    { label: "Weekly Off", value: summary.WEEK_OFF ?? 0, tone: "bg-slate-100 text-slate-700" },
    { label: "Half Day", value: (summary.HALF_DAY ?? 0) + (summary.HALF_DAY_LEAVE_PRESENT ?? 0), tone: "bg-amber-50 text-amber-700" },
    { label: "Missed Punch", value: summary.MISSED_PUNCH ?? 0, tone: "bg-orange-50 text-orange-700" }
  ];

  const columns: Column<Row>[] = [
    { key: "date", label: "Date", render: (value) => formatDate(String(value)) },
    { key: "employeeId", label: "Employee", render: (_, row) => getEmployeeLabel(row.employeeId) },
    { key: "firstIn", label: "First In", render: (value) => formatTime(value as string | null) },
    { key: "lastOut", label: "Last Out", render: (value) => formatTime(value as string | null) },
    { key: "totalWorkMinutes", label: "Worked Time", render: (value) => formatDuration(Number(value ?? 0)) },
    { key: "status", label: "Status", render: (value) => <AttendanceStatusBadge status={value as Row["status"]} /> },
    {
      key: "remarks",
      label: "Notes",
      render: (_, row) => (
        <div className="space-y-1">
          <p>{row.remarks || "--"}</p>
          <p className="text-xs text-slate-500">Department: {getDepartmentLabel(row.employeeId)}</p>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setEmployeeId("");
    setDepartmentId("");
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    setStatus("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleRecomputeRange = async () => {
    if (!fromDate || !toDate) {
      setError("Select both from date and to date to recompute attendance.");
      return;
    }

    try {
      const response = await recomputeAttendanceRange({
        employeeId: employeeId || undefined,
        fromDate,
        toDate
      });
      setSuccess(`Recomputed ${response.attendanceDaysProcessed} attendance day records.`);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to recompute attendance");
    }
  };

  if (user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/attendance" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Attendance Management</h2>
          <p className="mt-1 text-sm text-slate-500">Filter attendance records, inspect computed outcomes, and recompute when policy or punches change.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate("/attendance")}>Back</Button>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={handleRecomputeRange}>Recompute Range</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-3xl px-5 py-5 shadow-sm ${card.tone}`}>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectDropdown
            label="Employee"
            value={employeeId}
            onChange={(value) => {
              setEmployeeId(value);
              setPage(1);
            }}
            options={[{ label: "All Employees", value: "" }, ...filteredEmployees.map((item) => ({ label: item.name, value: item.id }))]}
          />
          <SelectDropdown
            label="Department"
            value={departmentId}
            onChange={(value) => {
              setDepartmentId(value);
              setEmployeeId("");
              setPage(1);
            }}
            options={[{ label: "All Departments", value: "" }, ...departments.map((item) => ({ label: item.name, value: item.id }))]}
          />
          <SelectDropdown
            label="Month"
            value={month}
            onChange={(value) => {
              setMonth(value);
              setPage(1);
            }}
            options={monthOptions}
          />
          <SelectDropdown
            label="Year"
            value={year}
            onChange={(value) => {
              setYear(value);
              setPage(1);
            }}
            options={yearOptions}
          />
          <SelectDropdown
            label="Status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statusOptions}
          />
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(value) => {
              setFromDate(value);
              setPage(1);
            }}
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(value) => {
              setToDate(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="relative">
        {loading ? <Loader variant="overlay" label="Loading attendance records..." /> : null}
        <DataTable
          columns={columns}
          data={items.map((item) => ({ ...item, id: item._id || item.dateKey }))}
          actions={[
            {
              label: "Recompute Day",
              onClick: async (row) => {
                const employee = row.employeeId;
                const resolvedEmployeeId = typeof employee === "string" ? employee : employee?._id || employee?.id;
                if (!resolvedEmployeeId) {
                  setError("Employee id not available for recompute.");
                  return;
                }

                try {
                  await recomputeAttendanceDay({
                    employeeId: resolvedEmployeeId,
                    date: row.date
                  });
                  setSuccess("Attendance day recomputed successfully.");
                  await loadData();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed to recompute attendance day");
                }
              }
            }
          ]}
          serverPagination={{
            enabled: true,
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: setLimit
          }}
        />
      </div>

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
      <ConfirmDialog open={!!success} title="Success" message={success} mode="Success" onConfirm={() => setSuccess("")} onCancel={() => setSuccess("")} />
    </div>
  );
}
