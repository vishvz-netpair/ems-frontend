import { useState } from "react"
import DataTable from "../components/table/DataTable"
import type { Column } from "../components/table/DataTable"
import { useNavigate } from "react-router-dom"
import EditEmployeeModal, { type EmployeeRow } from "../components/common/EditEmployeeModal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import Button from "../components/common/Button"


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
  {
  id: 4,
  empId: "EMP004",
  name: "Sneha Kapoor",
  department: "Engineering",
  designation: "Backend Developer",
  status: "Active",
},
{
  id: 5,
  empId: "EMP005",
  name: "Rohit Mehta",
  department: "HR",
  designation: "HR Executive",
  status: "Active",
},
{
  id: 6,
  empId: "EMP006",
  name: "Neha Shah",
  department: "Finance",
  designation: "Accountant",
  status: "Active",
},
{
  id: 7,
  empId: "EMP007",
  name: "Arjun Patel",
  department: "Engineering",
  designation: "Frontend Developer",
  status: "Inactive",
},
{
  id: 8,
  empId: "EMP008",
  name: "Kavya Desai",
  department: "Engineering",
  designation: "Project Manager",
  status: "Active",
},
{
  id: 9,
  empId: "EMP009",
  name: "Manish Kumar",
  department: "Finance",
  designation: "Accountant",
  status: "Inactive",
},
{
  id: 10,
  empId: "EMP010",
  name: "Pooja Singh",
  department: "HR",
  designation: "HR Executive",
  status: "Active",
},
{
  id: 11,
  empId: "EMP011",
  name: "Vikas Nair",
  department: "Engineering",
  designation: "Backend Developer",
  status: "Active",
},
{
  id: 12,
  empId: "EMP012",
  name: "Anjali Rao",
  department: "Finance",
  designation: "Accountant",
  status: "Active",
},
{
  id: 13,
  empId: "EMP013",
  name: "Saurabh Jain",
  department: "Engineering",
  designation: "Frontend Developer",
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

  const [sauccessOpen,setSuccessOpen]=useState(false)
  const [successMessage,setSuccessMessage]=useState(" ")


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
    setEditOpen(false)
    setSelectedEmployee(null)
    setSuccessMessage("Employee updated successfully")
    setSuccessOpen(true)
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

    setSuccessMessage("Employee deleted successfully.")
    setSuccessOpen(true)
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
        <Button
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
        </Button>
        <Button onClick={handleform}
        className="
            px-6 py-3 rounded-xl
            bg-indigo-600 text-white
            font-medium
            hover:bg-indigo-700
            transition
          "
        >Load Form</Button>
       
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
      <ConfirmDialog
      open={sauccessOpen}
      title="Success"
      message={successMessage}
      mode="Success"
      onConfirm={()=>setSuccessOpen(false)}
      onCancel={()=>setSuccessOpen(false)}
      />
    </div>
  )
}

export default Dashboard
