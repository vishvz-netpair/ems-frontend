import { useState } from "react"
import DataTable from "../components/table/DataTable"
import type { Column } from "../components/table/DataTable"
import { useNavigate } from "react-router-dom"
import EditEmployeeModal, { type EmployeeRow } from "../components/common/EditEmployeeModal"
import ConfirmDialog from "../components/common/ConfirmDialog"


const initialEmployees: EmployeeRow[] = [
  {
    id: 1,
    empId: "EMP001",
    name: "Rahul Sharma",
    department: "Engineering",
    designation: "Frontend Developer",
    status: "Active",
  },
  {
    id: 2,
    empId: "EMP002",
    name: "Priya Patel",
    department: "HR",
    designation: "HR Executive",
    status: "Active",
  },
  {
    id: 3,
    empId: "EMP003",
    name: "Amit Verma",
    department: "Finance",
    designation: "Accountant",
    status: "Inactive",
  },
]

const columns: Column<EmployeeRow>[] = [
  { key: "empId", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status" },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [showTable, setShowTable] = useState(false)
  const [employees, setEmployees] = useState<EmployeeRow[]>(initialEmployees)


  const [editOpen, setEditOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRow | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRow | null>(null)


  const handleView = (row: EmployeeRow) => {
    
    alert(
      `Employee Details\n\n` +
        `ID: ${row.empId}\n` +
        `Name: ${row.name}\n` +
        `Department: ${row.department}\n` +
        `Designation: ${row.designation}\n` +
        `Status: ${row.status}`
    )
  }

  const handleform = () => {
    navigate("/ui-demo")
  }

 
  const handleEdit = (row: EmployeeRow) => {
    setSelectedEmployee(row)
    setEditOpen(true)
  }

  
  const handleSaveEdit = (updated: EmployeeRow) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === updated.id ? updated : emp)))
  }

 
  const handleDelete = (row: EmployeeRow) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setEmployees((prev) => prev.filter((emp) => emp.id !== deleteTarget.id))
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  const cancelDelete = () => {
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Example: Reusable EMS table with working actions
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowTable(true)}
          className="
            px-6 py-3 rounded-xl
            bg-indigo-600 text-white
            font-medium
            hover:bg-indigo-700
            transition
          "
        >
          Load Employees
        </button>

        <button
          onClick={handleform}
          className="
            px-6 py-3 rounded-xl
            bg-indigo-600 text-white
            font-medium
            hover:bg-indigo-700
            transition
          "
        >
          Load Form
        </button>
      </div>

      {showTable && (
        <DataTable
          columns={columns}
          data={employees}
          actions={[
            { label: "View", onClick: handleView },
            { label: "Edit", onClick: handleEdit },
            { label: "Delete", onClick: handleDelete },
          ]}
        />
      )}

      <EditEmployeeModal
        key={selectedEmployee?.id}
        open={editOpen}
        employee={selectedEmployee}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Employee"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}" (${deleteTarget.empId})?`
            : "Are you sure you want to delete this employee?"
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

export default Dashboard
