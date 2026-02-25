import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { InputField } from "../../../form/InputField";
import SelectDropdown from "../../../form/SelectDropdown";
import DatePicker from "../../../form/DatePicker";
import type { ProjectEmployee } from "../../../services/projectService";
import type { TaskPriority, TaskItem } from "../../../services/taskService";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  members: ProjectEmployee[];
  initial?: TaskItem | null;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    assignedTo: string;
    priority: TaskPriority;
    dueDate: string | null;
    estimatedHours: number | null;
  }) => Promise<void> | void;
};

const priorityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
];

export default function TaskFormModal({
  open,
  mode,
  members,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const membersOptions = useMemo(
    () =>
      (members || []).map((m) => ({
        label: `${m.name} (${m.email})`,
        value: m._id,
      })),
    [members],
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [estimatedHours, setEstimatedHours] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      setTitle(initial.title ?? "");
      setDescription(initial.description ?? "");
      setAssignedTo(initial.assignedTo?._id ?? "");
      setPriority(initial.priority ?? "Medium");
      setDueDate(initial.dueDate ? String(initial.dueDate).slice(0, 10) : null);
      setEstimatedHours(
        initial.estimatedHours === null || initial.estimatedHours === undefined
          ? ""
          : String(initial.estimatedHours),
      );
    } else {
      setTitle("");
      setDescription("");
      setAssignedTo(membersOptions[0]?.value ?? "");
      setPriority("Medium");
      setDueDate(null);
      setEstimatedHours("");
    }
    setError("");
  }, [open, mode, initial, membersOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (t.length < 2) {
      setError("Task title is required");
      return;
    }
    if (!assignedTo) {
      setError("Please select an employee");
      return;
    }

    const hours = estimatedHours.trim() === "" ? null : Number(estimatedHours);
    if (estimatedHours.trim() !== "" && (Number.isNaN(hours) || (hours ?? 0) < 0)) {
      setError("Estimated hours must be a valid number");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: t,
        description: description.trim(),
        assignedTo,
        priority,
        dueDate,
        estimatedHours: hours,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save task";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "add" ? "New Task" : "Edit Task"}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="task-form" isLoading={submitting}>
            {mode === "add" ? "Create" : "Save"}
          </Button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="e.g. Integrate tasks API"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-900">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Optional details..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectDropdown
            label="Assign To"
            value={assignedTo}
            onChange={setAssignedTo}
            options={membersOptions}
          />
          <SelectDropdown
            label="Priority"
            value={priority}
            onChange={(v) => setPriority(v as TaskPriority)}
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Due Date"
            value={dueDate ?? ""}
            onChange={(v) => setDueDate(v ? v : null)}
          />
          <InputField
            label="Estimated Hours"
            value={estimatedHours}
            onChange={setEstimatedHours}
            placeholder="e.g. 6"
            inputMode="decimal"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </Modal>
  );
}