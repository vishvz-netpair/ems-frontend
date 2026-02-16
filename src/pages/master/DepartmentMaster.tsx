import { useMemo, useState } from "react"
import DataTable from "../../components/table/DataTable"
import type { Column } from "../../components/table/DataTable"
import MasterFormModal from "../../components/common/MasterFormModal"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { useDepartments } from "../../context/useDepartment"

type DepartmentRow = {
  id: number
  name: string
  status: "Active" | "Inactive"
}

const DepartmentMaster = () => {
const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();

 
  const [addOpen, setAddOpen] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<DepartmentRow | null>(null)

  
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DepartmentRow | null>(null)

  const [successOpen,setSuccessOpen]=useState(false)
  const [successMessage,setSuccessMessage]=useState("")

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
  addDepartment(payload);
  setAddOpen(false)

  setSuccessMessage("Department addedd successfully.")
  setSuccessOpen(true)
};


 const saveEdit = (payload: { name: string; status: "Active" | "Inactive" }) => {
  if (!selected) return;
  updateDepartment(selected.id, payload);
  setEditOpen(false)
  setSelected(null)

  setSuccessMessage("Department updated successfully.")
  setSuccessOpen(true)
};


  const confirmDelete = () => {
  if (!deleteTarget) return;
  deleteDepartment(deleteTarget.id);
  setDeleteOpen(false);
  setDeleteTarget(null);

  setSuccessMessage("Department deleted successfully.")
  setSuccessOpen(true)
};

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

      <MasterFormModal
       key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        title="Add Department"
        initialName=""
        initialStatus="Active"
        onClose={() => setAddOpen(false)}
        onSave={saveAdd}
      />

      <MasterFormModal
       key={selected?.id ?? "edit-none"}
        open={editOpen}
        title="Edit Department"
        initialName={selected?.name ?? ""}
        initialStatus={selected?.status ?? "Active"}
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />

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
      <ConfirmDialog
        open={successOpen}
        title="Success"
        message={successMessage}
        mode="Success"
        onConfirm={()=>setSuccessOpen(false)}
        onCancel={()=>setSuccessOpen(false)}
        />
    </div>
  )
}

export default DepartmentMaster
