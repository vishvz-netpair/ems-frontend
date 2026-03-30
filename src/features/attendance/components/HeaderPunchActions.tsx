import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import AttendanceDayMessage from "./AttendanceDayMessage";
import {
  addAttendancePunch,
  getAttendancePolicy,
  getMyDailyAttendance,
  NON_WORKING_ATTENDANCE_STATUSES,
  publishAttendanceDayUpdate,
  type AttendanceDayResponse,
  type AttendancePolicy
} from "../services/attendanceService";

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
  const [dayData, setDayData] = useState<AttendanceDayResponse>({
    summary: null,
    punches: [],
    status: "PRESENT"
  });
  const [policy, setPolicy] = useState<AttendancePolicy | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyDailyAttendance();
      setDayData(data);
      publishAttendanceDayUpdate(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const response = await getAttendancePolicy();
        setPolicy(response);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load attendance policy");
      }
    };

    loadPolicy();
  }, []);

  const handlePunch = async (punchType: "IN" | "OUT") => {
    setSubmitting(punchType);
    setError("");
    try {
      await addAttendancePunch({
        punchType,
        punchTime: getLocalPunchTimestamp(),
        source: "web"
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add punch");
    } finally {
      setSubmitting("");
    }
  };

  const summary = dayData.summary;
  const latestPunch = dayData.punches.length > 0 ? dayData.punches[dayData.punches.length - 1] : null;
  const isNonWorkingDay = summary ? NON_WORKING_ATTENDANCE_STATUSES.includes(summary.status) : false;
  const isCurrentlyPunchedIn = latestPunch?.punchType === "IN";
  const canPunchIn =
    !isNonWorkingDay &&
    !isCurrentlyPunchedIn &&
    (latestPunch?.punchType !== "OUT" || Boolean(policy?.multiplePunchAllowed));
  const canPunchOut = !isNonWorkingDay && isCurrentlyPunchedIn;

  return (
    <>
      <div className="hidden items-center gap-2 xl:flex">
        <AttendanceDayMessage status={dayData.status} compact />
        <Button
          size="sm"
          disabled={loading || submitting !== "" || !canPunchIn}
          isLoading={submitting === "IN"}
          onClick={() => handlePunch("IN")}
        >
          Punch In
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading || submitting !== "" || !canPunchOut}
          isLoading={submitting === "OUT"}
          onClick={() => handlePunch("OUT")}
        >
          Punch Out
        </Button>
      </div>

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
    </>
  );
}
