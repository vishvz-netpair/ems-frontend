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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
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
              <th className="px-5 py-3 text-center font-semibold text-slate-700">
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
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {actions.map(action => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={`
                          text-sm font-medium underline-offset-2
                          hover:underline
                          ${
                            action.label === "Delete"
                              ? "text-red-600 hover:text-red-700"
                              : "text-indigo-600 hover:text-indigo-700"
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
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
