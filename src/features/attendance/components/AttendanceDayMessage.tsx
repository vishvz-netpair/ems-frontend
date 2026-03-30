import type { AttendanceDayUiStatus } from "../services/attendanceService";

const toneMap: Record<Exclude<AttendanceDayUiStatus, "PRESENT">, string> = {
  MISSED_PUNCH: "border-orange-200 bg-orange-50 text-orange-700",
  LATE: "border-amber-200 bg-amber-50 text-amber-700",
  ABSENT: "border-rose-200 bg-rose-50 text-rose-700"
};

const labelMap: Record<Exclude<AttendanceDayUiStatus, "PRESENT">, string> = {
  MISSED_PUNCH: "Missed Punch",
  LATE: "You are late",
  ABSENT: "Marked as Absent"
};

type Props = {
  status?: AttendanceDayUiStatus | null;
  compact?: boolean;
};

export default function AttendanceDayMessage({ status = "PRESENT", compact = false }: Props) {
  if (!status || status === "PRESENT") {
    return null;
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[status]} ${
        compact ? "" : "shadow-sm"
      }`}
    >
      {labelMap[status]}
    </span>
  );
}
