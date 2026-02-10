import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

type MasterFormModalProps={
    open:boolean
    title:string
    initialName:string
    initialStatus?:"Active"| "Inactive"
    onClose:()=>void
    onSave:(payload:{name:string;status:"Active"|"Inactive"})=>void
}
const MasterFormModal=({
    open,
    title,
    initialName,
    initialStatus="Active",
    onClose,
    onSave,
}:MasterFormModalProps)=>{
    const [name, setName] = useState<string>(() => initialName)
const [status, setStatus] = useState<"Active" | "Inactive">(() => initialStatus)
const [error, setError] = useState("")


   
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
        const trimmed=name.trim()

        if(!trimmed){
            setError("Name is required")
            return
        }
        onSave({name:trimmed,status})
        onClose()
    }
    return(
        <Modal
         open={open}
         title={title}
         onClose={onClose}
         footer={
            <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >Cancel</Button>
                  <Button
                  type="submit"
            form="master-form"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Save
                  </Button>
            </div>
         }
            >
  <form id="master-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError("")
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter name"
          />
          {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </form>
        </Modal>
    )

}
export default MasterFormModal