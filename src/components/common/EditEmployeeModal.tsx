import {  useState } from "react"
import Modal from "../common/Modal"

export type EmployeeRow = {
  id: number
  empId: string
  name: string
  department: string
  designation: string
  status: string
}

type Props = {
  open: boolean
  employee: EmployeeRow | null
  onClose: () => void
  onSave: (updated: EmployeeRow) => void
}

const EditEmployeeModal = ({ open, employee, onClose, onSave }: Props) => {
  const [form, setForm] = useState<EmployeeRow | null>(()=>
        employee?{...employee}:null)

 

  const updateField = (key: keyof EmployeeRow, value: string) => {
    if (!form) return
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    onSave(form)
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Edit Employee"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-employee-form"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      }
    >
      {!form ? (
        <p className="text-slate-600">No employee selected.</p>
      ) : (
        <form id="edit-employee-form" onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="text-sm font-medium text-slate-700">Employee ID</label>
            <input
              value={form.empId}
              disabled
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Department</label>
            <input
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter department"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Designation</label>
            <input
              value={form.designation}
              onChange={(e) => updateField("designation", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter designation"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default EditEmployeeModal
