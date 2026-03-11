import { useEffect, useMemo, useState } from "react";
import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Loader from "../../../components/ui/Loader";
import LeaveTypeModal from "../components/LeaveTypeModal";
import {
  createLeaveType,
  deleteLeaveType,
  listLeaveTypes,
  updateLeaveType,
  type LeaveTypeItem,
  type LeaveTypePayload,
} from "../services/leaveService";

type Row = LeaveTypeItem & { id: string };

export default function LeaveTypesPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LeaveTypeItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<LeaveTypeItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<LeaveTypeItem | null>(null);

  const columns: Column<Row>[] = useMemo(
    () => [
      { key: "name", label: "Leave Type" },
      { key: "code", label: "Code" },
      { key: "allocationPeriod", label: "Allocation" },
      { key: "totalAllocation", label: "Allocation Qty" },
      { key: "approvalWorkflowType", label: "Workflow" },
      { key: "status", label: "Status" },
    ],
    [],
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await listLeaveTypes();
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch leave types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (payload: LeaveTypePayload, mode: "add" | "edit") => {
    try {
      if (mode === "add") {
        await createLeaveType(payload);
        setAddOpen(false);
        setSuccess("Leave type created successfully.");
      } else if (editItem) {
        await updateLeaveType(editItem.id, payload);
        setEditItem(null);
        setSuccess("Leave type updated successfully.");
      }
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save leave type");
    }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await deleteLeaveType(deleteItem.id);
      setDeleteItem(null);
      setSuccess("Leave type deleted successfully.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete leave type");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Leave Types</h2>
          <p className="mt-1 text-sm text-slate-500">Configure leave rules, workflow depth, carry forward, accrual, and attachment policies.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Leave Type
        </button>
      </div>

      {loading ? (
        <Loader variant="block" label="Loading leave types..." />
      ) : (
        <DataTable
          columns={columns}
          data={items.map((item) => ({ ...item, id: item.id }))}
          actions={[
            { label: "Edit", onClick: (row) => setEditItem(row) },
            { label: "Delete", onClick: (row) => setDeleteItem(row) },
          ]}
        />
      )}

      <LeaveTypeModal open={addOpen} mode="add" onClose={() => setAddOpen(false)} onSave={(payload) => save(payload, "add")} />
      <LeaveTypeModal open={!!editItem} mode="edit" initial={editItem} onClose={() => setEditItem(null)} onSave={(payload) => save(payload, "edit")} />

      <ConfirmDialog
        open={!!deleteItem}
        title="Delete Leave Type"
        message={deleteItem ? `Delete "${deleteItem.name}"? Existing requests will keep their snapshots.` : "Delete this leave type?"}
        danger
        onConfirm={remove}
        onCancel={() => setDeleteItem(null)}
      />

      <ConfirmDialog open={!!error} title="Error" message={error} onConfirm={() => setError("")} onCancel={() => setError("")} />
      <ConfirmDialog open={!!success} title="Success" message={success} mode="Success" onConfirm={() => setSuccess("")} onCancel={() => setSuccess("")} />
    </div>
  );
}
