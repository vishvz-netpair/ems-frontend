import Button from "../../../components/common/Button";
import type { TaskItem, TaskStatus } from "../../../services/taskService";
import { formatDate } from "../../../utils/date";

type Props = {
  task: TaskItem;
  canManage: boolean;
  isEmployee: boolean;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onChangeStatus: (task: TaskItem, status: TaskStatus) => void;
};

const statusOptions: TaskStatus[] = ["Pending", "In Progress", "In Review", "Completed"];

function isOverdue(task: TaskItem) {
  if (!task.dueDate) return false;
  if (task.status === "Completed") return false;
  const d = new Date(task.dueDate);
  const now = new Date();
  d.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return d < now;
}

function priorityBadge(priority: TaskItem["priority"]) {
  switch (priority) {
    case "Low":
      return "bg-slate-100 text-slate-700";
    case "Medium":
      return "bg-blue-100 text-blue-700";
    case "High":
      return "bg-amber-100 text-amber-800";
    case "Critical":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function TaskCard({
  task,
  canManage,
  isEmployee,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  const overdue = isOverdue(task);

  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-sm space-y-2 ${
        overdue ? "border-red-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-2">{task.title}</p>
          {task.description ? (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          ) : null}
        </div>

        <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${priorityBadge(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
          {task.assignedTo?.name ?? "-"}
        </span>

        {task.dueDate ? (
          <span
            className={`rounded-full border px-2 py-1 ${
              overdue ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50"
            }`}
          >
            Due: {formatDate(task.dueDate)}
          </span>
        ) : null}

        {typeof task.estimatedHours === "number" ? (
          <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
            Est: {task.estimatedHours}h
          </span>
        ) : null}

        {overdue ? (
          <span className="rounded-full bg-red-100 text-red-700 px-2 py-1 font-medium">
            Overdue
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <select
          value={task.status}
          onChange={(e) => onChangeStatus(task, e.target.value as TaskStatus)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} disabled={isEmployee && s === "Completed"}>
              {s}
            </option>
          ))}
        </select>

        {canManage ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
              Delete
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}