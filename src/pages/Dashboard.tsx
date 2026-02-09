import { useState } from "react"
import DataTable from "../components/table/DataTable"
import type { Column } from "../components/table/DataTable"
import { useNavigate } from "react-router-dom"

/* EMS-style data type */
type EmployeeRow = {
  id: number
  empId: string
  name: string
  department: string
  designation: string
  status: string
}

/* Initial data */
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
  const [employees, setEmployees] =
    useState<EmployeeRow[]>(initialEmployees)

  /* ACTION HANDLERS */

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
  const handleform = ()=>{
    navigate("/ui-demo")
  } 
  const handleEdit = (row: EmployeeRow) => {
    const field = prompt(
      "What do you want to edit?\n(name / designation / status)"
    )

    if (!field) return

    const newValue = prompt(`Enter new value for ${field}`)
    if (!newValue) return

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === row.id
          ? { ...emp, [field]: newValue }
          : emp
      )
    )
  }

  const handleDelete = (row: EmployeeRow) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${row.name}?`
    )

    if (!confirmDelete) return

    setEmployees(prev =>
      prev.filter(emp => emp.id !== row.id)
    )
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Example: Reusable EMS table with working actions
        </p>
      </div>

      {/* Button to render table */}
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
        onClick={() => handleform()}
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

      {/* Table renders only after click */}
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
    </div>
  )
}

export default Dashboard
