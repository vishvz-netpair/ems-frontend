import { useMemo, useState } from "react"
import DataTable from "../components/table/DataTable"
import type { Column } from "../components/table/DataTable"
import MasterFormModal from "../components/common/MasterFormModal"
import ConfirmDialog from "../components/common/ConfirmDialog"

type DepartmentRow = {
  id: number
  name: string
  status: "Active" | "Inactive"
}

const initialDepartments: DepartmentRow[] = [
  { id: 1, name: "Engineering", status: "Active" },
  { id: 2, name: "HR", status: "Active" },
  { id: 3, name: "Finance", status: "Inactive" },
]

const DepartmentMaster = () => {
  const [departments, setDepartments] = useState<DepartmentRow[]>(initialDepartments)

  // Add modal
  const [addOpen, setAddOpen] = useState(false)

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<DepartmentRow | null>(null)

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DepartmentRow | null>(null)

  const columns: Column<DepartmentRow>[] = useMemo(
    () => [
      { key: "name", label: "Department" },
      { key: "status", label: "Status" },
    ],
    []
  )

  const openAdd = () => setAddOpen(true)

  const openEdit = (row: DepartmentRow) => {
    setSelected(row)
    setEditOpen(true)
  }

  const openDelete = (row: DepartmentRow) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const saveAdd = (payload: { name: string; status: "Active" | "Inactive" }) => {
    setDepartments((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((d) => d.id)) + 1 : 1
      return [...prev, { id: nextId, name: payload.name, status: payload.status }]
    })
  }

  const saveEdit = (payload: { name: string; status: "Active" | "Inactive" }) => {
    if (!selected) return
    setDepartments((prev) =>
      prev.map((d) => (d.id === selected.id ? { ...d, name: payload.name, status: payload.status } : d))
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id))
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
          <h2 className="text-2xl font-semibold text-slate-800">Department Master</h2>
          <p className="text-sm text-slate-500">Manage departments (Add / Edit / Delete)</p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Add Department
        </button>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        actions={[
          { label: "Edit", onClick: openEdit },
          { label: "Delete", onClick: openDelete },
        ]}
      />

      {/* ✅ Add Modal */}
      <MasterFormModal
       key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        title="Add Department"
        initialName=""
        initialStatus="Active"
        onClose={() => setAddOpen(false)}
        onSave={saveAdd}
      />

      {/* ✅ Edit Modal */}
      <MasterFormModal
       key={selected?.id ?? "edit-none"}
        open={editOpen}
        title="Edit Department"
        initialName={selected?.name ?? ""}
        initialStatus={selected?.status ?? "Active"}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

      {/* ✅ Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Department"
        message={
          deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : "Are you sure you want to delete?"
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

export default DepartmentMaster
