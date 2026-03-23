import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Loader from "../../../components/ui/Loader";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import DatePicker from "../../../components/ui/DatePicker";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import { getSession, hasAccess } from "../../auth/services/auth";
import { formatDate } from "../../../utils/date";
import {
  createLeaveHoliday,
  deleteLeaveHoliday,
  listLeaveHolidays,
  updateLeaveHoliday,
  type LeaveHolidayItem,
} from "../services/leaveService";

type Row = LeaveHolidayItem & {
  id: string;
};

type FormValues = {
  name: string;
  date: string;
  description: string;
  scope: string;
  isActive: "true" | "false";
};

const initialForm: FormValues = {
  name: "",
  date: "",
  description: "",
  scope: "company",
  isActive: "true",
};

export default function HolidayMaster() {
  const { user } = getSession();
  const canManageHolidays = hasAccess(user?.role, "leaveHolidays");

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);
  const [viewRow, setViewRow] = useState<Row | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [form, setForm] = useState<FormValues>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all");

  const columns: Column<Row>[] = useMemo(
    () => [
      { key: "name", label: "Holiday" },
      { key: "date", label: "Date", render: (value) => formatDate(String(value)) },
      { key: "scope", label: "Scope" },
      {
        key: "isActive",
        label: "Status",
        render: (value) => (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${value ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [],
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await listLeaveHolidays({ search, scope: scopeFilter, isActive: statusFilter });
      setRows(res.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageHolidays) {
      load();
    }
  }, [canManageHolidays, search, scopeFilter, statusFilter]);

  if (!canManageHolidays) {
    return <Navigate to="/dashboard" replace />;
  }

  const openAdd = () => {
    setSelected(null);
    setForm(initialForm);
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setSelected(row);
    setForm({
      name: row.name,
      date: row.date.slice(0, 10),
      description: row.description,
      scope: row.scope,
      isActive: row.isActive ? "true" : "false",
    });
    setFormOpen(true);
  };

  const openView = (row: Row) => {
    setViewRow(row);
    setViewOpen(true);
  };

  const saveHoliday = async () => {
    if (!form.name.trim() || !form.date) {
      setError("Holiday name and date are required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      date: form.date,
      description: form.description.trim(),
      scope: form.scope.trim() || "company",
      isActive: form.isActive === "true",
    };

    try {
      if (selected) {
        await updateLeaveHoliday(selected.id, payload);
        setSuccess("Holiday updated successfully.");
      } else {
        await createLeaveHoliday(payload);
        setSuccess("Holiday added successfully.");
      }
      setFormOpen(false);
      setSelected(null);
      setForm(initialForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save holiday");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLeaveHoliday(deleteTarget.id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      setSuccess("Holiday deleted successfully.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete holiday");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setScopeFilter("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Holiday Master</h2>
        <p className="text-sm text-slate-500">Manage company holidays that should appear in calendars and be excluded from leave counting.</p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row xl:max-w-4xl">
          <InputField label="Search" value={search} onChange={(value) => setSearch(value)} placeholder="Search holiday..." />
          <InputField label="Scope" value={scopeFilter} onChange={(value) => setScopeFilter(value)} placeholder="company" />
          <SelectDropdown
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as "all" | "true" | "false")}
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" }
            ]}
          />
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
        <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700">Add Holiday</Button>
      </div>

      {loading ? (
        <Loader variant="block" label="Loading holidays..." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          actions={[
            { label: "View", onClick: openView },
            { label: "Edit", onClick: openEdit },
            {
              label: "Delete",
              onClick: (row) => {
                setDeleteTarget(row);
                setDeleteOpen(true);
              },
            },
          ]}
        />
      )}

      <Modal
        open={formOpen}
        title={selected ? "Edit Holiday" : "Add Holiday"}
        onClose={() => setFormOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={saveHoliday} className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <InputField label="Holiday Name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} placeholder="Enter holiday name" />
          <DatePicker label="Holiday Date" value={form.date} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
          <InputField label="Description" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} placeholder="Optional description" />
          <InputField label="Scope" value={form.scope} onChange={(value) => setForm((prev) => ({ ...prev, scope: value }))} placeholder="company" />
          <SelectDropdown
            label="Status"
            value={form.isActive}
            onChange={(value) => setForm((prev) => ({ ...prev, isActive: value as "true" | "false" }))}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />
        </div>
      </Modal>

      <Modal open={viewOpen} title="View Holiday" onClose={() => setViewOpen(false)}>
        <div className="space-y-2 text-slate-700">
          <div><b>Name:</b> {viewRow?.name ?? "-"}</div>
          <div><b>Date:</b> {viewRow?.date ? formatDate(viewRow.date) : "-"}</div>
          <div><b>Description:</b> {viewRow?.description || "-"}</div>
          <div><b>Scope:</b> {viewRow?.scope ?? "-"}</div>
          <div><b>Status:</b> {viewRow?.isActive ? "Active" : "Inactive"}</div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Holiday"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : "Are you sure?"}
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
      <ConfirmDialog open={!!success} title="Success" message={success} mode="Success" onConfirm={() => setSuccess("")} onCancel={() => setSuccess("")} />
    </div>
  );
}
