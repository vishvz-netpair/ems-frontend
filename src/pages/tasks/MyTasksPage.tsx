import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Button from "../../components/common/Button";
import { getMyTasks, updateTaskStatus, type MyTaskItem, type TaskStatus } from "../../services/taskService";
import { formatDate } from "../../utils/date";

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: "Pending", label: "Pending" },
  { key: "In Progress", label: "In Progress" },
  { key: "In Review", label: "In Review" },
  { key: "Completed", label: "Completed" },
];

function isOverdue(t: MyTaskItem) {
  if (!t.dueDate) return false;
  if (t.status === "Completed") return false;
  const d = new Date(t.dueDate);
  const now = new Date();
  d.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return d < now;
}

function priorityBadge(priority: MyTaskItem["priority"]) {
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

export default function MyTasksPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MyTaskItem[]>([]);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyTasks();
      setItems(res.items || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load tasks";
      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, MyTaskItem[]> = {
      "Pending": [],
      "In Progress": [],
      "In Review": [],
      "Completed": [],
    };
    items.forEach((t) => g[t.status]?.push(t));
    return g;
  }, [items]);

  const changeStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update status";
      setErrorMsg(msg);
      setErrorOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">My Tasks</h2>
          <p className="text-sm text-slate-500">Tasks assigned to you across projects</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.key} className="rounded-2xl border border-slate-200 bg-slate-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">{col.label}</h4>
                  <span className="text-xs text-slate-500">{grouped[col.key].length}</span>
                </div>
              </div>

              <div className="p-3 space-y-3 min-h-[120px]">
                {grouped[col.key].length === 0 ? (
                  <div className="text-xs text-slate-500">No tasks</div>
                ) : (
                  grouped[col.key].map((t) => {
                    const overdue = isOverdue(t);
                    return (
                      <div
                        key={t._id}
                        className={`rounded-xl border bg-white p-3 shadow-sm space-y-2 ${
                          overdue ? "border-red-300" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 line-clamp-2">{t.title}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {t.projectId?.name ?? "Project"}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${priorityBadge(t.priority)}`}>
                            {t.priority}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          {t.dueDate ? (
                            <span
                              className={`rounded-full border px-2 py-1 ${
                                overdue
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-slate-200 bg-slate-50"
                              }`}
                            >
                              Due: {formatDate(t.dueDate)}
                            </span>
                          ) : null}
                          {typeof t.estimatedHours === "number" ? (
                            <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
                              Est: {t.estimatedHours}h
                            </span>
                          ) : null}
                          {overdue ? (
                            <span className="rounded-full bg-red-100 text-red-700 px-2 py-1 font-medium">
                              Overdue
                            </span>
                          ) : null}
                        </div>

                        <select
                          value={t.status}
                          onChange={(e) => changeStatus(t._id, e.target.value as TaskStatus)}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Review">In Review</option>
                          <option value="Completed" disabled>
                            Completed
                          </option>
                        </select>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={errorOpen}
        title="Error"
        message={errorMsg}
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />
    </div>
  );
}