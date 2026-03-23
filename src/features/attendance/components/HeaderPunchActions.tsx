import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import AttendanceStatusBadge from "./AttendanceStatusBadge";
import { addAttendancePunch, getMyDailyAttendance, type AttendanceDayResponse } from "../services/attendanceService";

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

export default function HeaderPunchActions() {
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

  return (
    <>
      <div className="hidden items-center gap-2 xl:flex">
        {summary ? <AttendanceStatusBadge status={summary.status} /> : null}
        <Button
          size="sm"
          disabled={loading || isApprovedLeaveDay}
          isLoading={submitting === "IN"}
          onClick={() => handlePunch("IN")}
        >
          Punch In
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading || isApprovedLeaveDay}
          isLoading={submitting === "OUT"}
          onClick={() => handlePunch("OUT")}
        >
          Punch Out
        </Button>
      </div>

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
      <ConfirmDialog open={!!success} title="Success" message={success} mode="Success" onConfirm={() => setSuccess("")} onCancel={() => setSuccess("")} />
    </>
  );
}
