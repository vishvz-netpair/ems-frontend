import { useMemo, useState } from "react"

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

  /* ✅ Pagination State */
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1
  const safePage = currentPage > totalPages ? 1 : currentPage

  /* ✅ Paginated Data */
  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * rowsPerPage
    return data.slice(startIndex, startIndex + rowsPerPage)
  }, [data, safePage, rowsPerPage])

  /* ✅ Handle Page Change */
  const goPrevious = () => {
    if (safePage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goNext = () => {
    if (safePage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  /* ✅ Handle Page Size Change */
  const handlePageSizeChange = (value: number) => {
    setRowsPerPage(value)
    setCurrentPage(1) // reset to first page
  }

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
          {paginatedData.map(row => (
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

          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-5 py-6 text-center text-slate-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-4 border-t bg-slate-50">

        {/* Page Size Dropdown */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-300 px-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Info */}
        <div className="text-sm text-slate-600">
          Page {safePage} of {totalPages}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrevious}
            disabled={safePage === 1}
            className="px-3 py-1 text-sm rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={goNext}
            disabled={safePage === totalPages}
            className="px-3 py-1 text-sm rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}

export default DataTable
