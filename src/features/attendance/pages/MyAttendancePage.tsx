import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import AttendanceStatusBadge from "../components/AttendanceStatusBadge";
import { getMyMonthlyAttendance, type AttendanceDailySummary } from "../services/attendanceService";
import { formatDate } from "../../../utils/date";
import { getSession } from "../../auth/services/auth";

type Row = AttendanceDailySummary & { id: string };

const monthOptions = [
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

function formatTime(value?: string | null) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export default function MyAttendancePage() {
  const { user } = getSession();
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AttendanceDailySummary[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, index) => {
      const value = String(currentYear - 2 + index);
      return { label: value, value };
    });
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyMonthlyAttendance({
        month: Number(month),
        year: Number(year)
      });
      setItems(data.items || []);
      setSummary(data.summary || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load monthly attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const clearFilters = () => {
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
  };

  const cards = [
    { label: "Present", value: summary.PRESENT ?? 0, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Half Day", value: (summary.HALF_DAY ?? 0) + (summary.HALF_DAY_LEAVE_PRESENT ?? 0), tone: "bg-amber-50 text-amber-700" },
    { label: "Leave", value: summary.LEAVE ?? 0, tone: "bg-sky-50 text-sky-700" },
    { label: "Holiday / Off", value: (summary.HOLIDAY ?? 0) + (summary.WEEK_OFF ?? 0), tone: "bg-slate-900 text-white" }
  ];

  const columns: Column<Row>[] = [
    { key: "date", label: "Date", render: (value) => formatDate(String(value)) },
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
          <div className="flex flex-wrap gap-2">
            {row.isHalfDayLeave ? <span className="rounded-full bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-700">Half-day leave</span> : null}
            {row.weeklyOffApplied ? <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">Weekly off</span> : null}
            {row.holidayId && typeof row.holidayId === "object" ? (
              <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">{row.holidayId.name || "Holiday"}</span>
            ) : null}
          </div>
        </div>
      )
    }
  ];

  if (user?.role !== "employee" && user?.role !== "teamLeader" && user?.role !== "HR") {
    return <Navigate to="/attendance" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">My Attendance</h2>
          <p className="mt-1 text-sm text-slate-500">Review your monthly attendance with backend-calculated statuses.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate("/attendance")}>
            Back
          </Button>
          <SelectDropdown label="Month" value={month} onChange={setMonth} options={monthOptions} />
          <SelectDropdown label="Year" value={year} onChange={setYear} options={yearOptions} />
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
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

      {loading ? (
        <Loader variant="block" label="Loading monthly attendance..." />
      ) : (
        <DataTable columns={columns} data={items.map((item) => ({ ...item, id: item._id || item.dateKey }))} />
      )}

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
    </div>
  );
}


