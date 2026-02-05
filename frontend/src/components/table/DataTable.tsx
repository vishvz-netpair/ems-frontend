import { useState } from "react"

export type Column<T> = {
  key: keyof T
  label: string
}

export type Action<T> = {
  label: "View" | "Edit" | "Delete"
  onClick: (row: T) => void
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  actions?: Action<T>[]
}

function DataTable<T extends { id: number }>({
  columns,
  data,
  actions,
}: DataTableProps<T>) {
  const [openRowId, setOpenRowId] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        
        {/* Header */}
        <thead className="bg-slate-100">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-5 py-3 text-left font-semibold text-slate-700"
              >
                {col.label}
              </th>
            ))}

            {actions && (
              <th className="px-5 py-3 text-right font-semibold text-slate-700">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map(row => (
            <tr
              key={row.id}
              className="border-t hover:bg-slate-50 transition"
            >
              {columns.map(col => (
                <td
                  key={String(col.key)}
                  className="px-5 py-4 text-slate-700"
                >
                  {String(row[col.key])}
                </td>
              ))}

              {actions && (
                <td className="px-5 py-4 text-right relative">
                  {/* Three dots */}
                  <button
                    onClick={() =>
                      setOpenRowId(openRowId === row.id ? null : row.id)
                    }
                    className="text-xl text-slate-500 hover:text-slate-800"
                  >
                    ⋮
                  </button>

                  {/* Dropdown */}
                  {openRowId === row.id && (
                    <div className="absolute right-6 mt-2 w-32 bg-white border rounded-xl shadow-lg z-10">
                      {actions.map(action => (
                        <button
                          key={action.label}
                          onClick={() => {
                            action.onClick(row)
                            setOpenRowId(null)
                          }}
                          className="
                            w-full text-left px-4 py-2 text-sm
                            hover:bg-slate-100
                            transition
                          "
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
