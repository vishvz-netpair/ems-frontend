import { useMemo, useState } from "react"
import DataTable from "../components/table/DataTable"
import type { Column } from "../components/table/DataTable"
import MasterFormModal from "../components/common/MasterFormModal"
import ConfirmDialog from "../components/common/ConfirmDialog"

type DesignationRow = {
  id: number
  name: string
  status: "Active" | "Inactive"
}

const initialDesignations: DesignationRow[] = [
  { id: 1, name: "Frontend Developer", status: "Active" },
  { id: 2, name: "Backend Developer", status: "Active" },
  { id: 3, name: "HR Executive", status: "Active" },
  { id: 4, name: "Accountant", status: "Inactive" },
]

const DesignationMaster = () => {
  const [designations, setDesignations] =
    useState<DesignationRow[]>(initialDesignations)

  // Add modal
  const [addOpen, setAddOpen] = useState(false)

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<DesignationRow | null>(null)

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DesignationRow | null>(null)

  const columns: Column<DesignationRow>[] = useMemo(
    () => [
      { key: "name", label: "Designation" },
      { key: "status", label: "Status" },
    ],
    []
  )

  const openAdd = () => setAddOpen(true)

  const openEdit = (row: DesignationRow) => {
    setSelected(row)
    setEditOpen(true)
  }

  const openDelete = (row: DesignationRow) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const saveAdd = (payload: { name: string; status: "Active" | "Inactive" }) => {
    setDesignations((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1
      return [...prev, { id: nextId, name: payload.name, status: payload.status }]
    })
  }

  const saveEdit = (payload: { name: string; status: "Active" | "Inactive" }) => {
    if (!selected) return
    setDesignations((prev) =>
      prev.map((d) =>
        d.id === selected.id ? { ...d, name: payload.name, status: payload.status } : d
      )
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setDesignations((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  const cancelDelete = () => {
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Designation Master
          </h2>
          <p className="text-sm text-slate-500">
            Manage designations (Add / Edit / Delete)
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Add Designation
        </button>
      </div>

      <DataTable
        columns={columns}
        data={designations}
        actions={[
          { label: "Edit", onClick: openEdit },
          { label: "Delete", onClick: openDelete },
        ]}
      />

      {/* ✅ Add Modal */}
      <MasterFormModal
        key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        title="Add Designation"
        initialName=""
        initialStatus="Active"
        onClose={() => setAddOpen(false)}
        onSave={saveAdd}
      />

      {/* ✅ Edit Modal */}
      <MasterFormModal
        key={selected?.id ?? "edit-none"}
        open={editOpen}
        title="Edit Designation"
        initialName={selected?.name ?? ""}
        initialStatus={selected?.status ?? "Active"}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

      {/* ✅ Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Designation"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"?`
            : "Are you sure you want to delete?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default DesignationMaster
