import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Loader from "../../../components/ui/Loader";
import { formatDate } from "../../../utils/date";
import AttendanceStatusBadge from "../components/AttendanceStatusBadge";
import { addAttendancePunch, getMyDailyAttendance, type AttendanceDayResponse } from "../services/attendanceService";

function formatTime(value?: string | null) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getLocalPunchTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export default function EmployeeAttendancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<"" | "IN" | "OUT">("");
  const [dayData, setDayData] = useState<AttendanceDayResponse>({ summary: null, punches: [] });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyDailyAttendance();
      setDayData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePunch = async (punchType: "IN" | "OUT") => {
    setSubmitting(punchType);
    try {
      await addAttendancePunch({
        punchType,
        punchTime: getLocalPunchTimestamp(),
        source: "web"
      });
      setSuccess(`${punchType} punch added successfully.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add punch");
    } finally {
      setSubmitting("");
    }
  };

  const summary = dayData.summary;
  const isApprovedLeaveDay = summary?.status === "LEAVE";
  const cards = useMemo(
    () => [
      { label: "First In", value: formatTime(summary?.firstIn), tone: "bg-slate-900 text-white" },
      { label: "Last Out", value: formatTime(summary?.lastOut), tone: "bg-sky-50 text-sky-700" },
      { label: "Worked Time", value: formatMinutes(summary?.totalWorkMinutes ?? 0), tone: "bg-emerald-50 text-emerald-700" },
      { label: "Late Minutes", value: String(summary?.lateMinutes ?? 0), tone: "bg-amber-50 text-amber-700" }
    ],
    [summary]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Attendance</h2>
          <p className="mt-1 text-sm text-slate-500">Track today&apos;s punch events and your final attendance status.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate("/my-attendance")}>
            My Attendance
          </Button>
          <Button disabled={isApprovedLeaveDay} isLoading={submitting === "IN"} onClick={() => handlePunch("IN")}>
            Punch In
          </Button>
          <Button
            variant="outline"
            disabled={isApprovedLeaveDay}
            isLoading={submitting === "OUT"}
            onClick={() => handlePunch("OUT")}
          >
            Punch Out
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{summary ? formatDate(summary.date) : formatDate(new Date().toISOString())}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {summary ? <AttendanceStatusBadge status={summary.status} /> : null}
            {summary?.isHalfDayLeave ? (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">Half-day leave applied</span>
            ) : null}
            {summary?.weeklyOffApplied ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Weekly off</span>
            ) : null}
            {summary?.holidayId && typeof summary.holidayId === "object" ? (
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{summary.holidayId.name || "Holiday"}</span>
            ) : null}
          </div>
        </div>
        {isApprovedLeaveDay ? (
          <p className="mt-3 text-sm text-slate-500">Punch actions are disabled because this date has an approved leave.</p>
        ) : null}
      </div>

      {loading ? (
        <Loader variant="block" label="Loading attendance..." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className={`rounded-3xl px-5 py-5 shadow-sm ${card.tone}`}>
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Today&apos;s Punch History</h3>
                <p className="text-sm text-slate-500">Punches are shown in time order from the backend event log.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {dayData.punches.length} punch{dayData.punches.length === 1 ? "" : "es"}
              </span>
            </div>

            {dayData.punches.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No punches recorded for today.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {dayData.punches.map((punch, index) => (
                  <div key={`${punch.punchTime}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{formatTime(punch.punchTime)}</p>
                      <p className="mt-1 text-sm text-slate-500">{punch.remarks || "Recorded from web punch action"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${punch.punchType === "IN" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>
                        {punch.punchType}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{punch.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
      <ConfirmDialog open={!!success} title="Success" message={success} mode="Success" onConfirm={() => setSuccess("")} onCancel={() => setSuccess("")} />
    </div>
  );
}
