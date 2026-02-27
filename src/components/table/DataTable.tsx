import { useMemo, useState, useEffect } from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
};

export type Action<T> = {
  label: string;
  onClick: (row: T) => void;
};

type ServerPagination = {
  enabled: true;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];

  // ✅ optional: if not provided, works exactly like before (client-side)
  serverPagination?: ServerPagination;
};

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  actions,
  serverPagination,
}: DataTableProps<T>) {
  // Client-side state (only used when serverPagination not enabled)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isServer = !!serverPagination?.enabled;

  // keep local state in sync if switching modes
  useEffect(() => {
    if (isServer) return;
    // if data changes and current page becomes invalid
    const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
    if (currentPage > totalPages) setCurrentPage(1);
  }, [data, rowsPerPage, currentPage, isServer]);

  const effectivePage = isServer ? serverPagination.page : currentPage;
  const effectiveLimit = isServer ? serverPagination.limit : rowsPerPage;

  const totalItems = isServer ? serverPagination.total : data.length;
  const totalPages = Math.ceil(totalItems / effectiveLimit) || 1;

  const paginatedData = useMemo(() => {
    if (isServer) return data; // ✅ server already paginated
    const startIndex = (effectivePage - 1) * effectiveLimit;
    return data.slice(startIndex, startIndex + effectiveLimit);
  }, [data, isServer, effectivePage, effectiveLimit]);

  const goPrevious = () => {
    if (effectivePage <= 1) return;
    if (isServer) serverPagination.onPageChange(effectivePage - 1);
    else setCurrentPage((prev) => prev - 1);
  };

  const goNext = () => {
    if (effectivePage >= totalPages) return;
    if (isServer) serverPagination.onPageChange(effectivePage + 1);
    else setCurrentPage((prev) => prev + 1);
  };

  const handlePageSizeChange = (value: number) => {
    if (isServer) {
      serverPagination.onLimitChange(value);
      serverPagination.onPageChange(1); // reset to page 1
    } else {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((col) => (
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

        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={String(row.id)}
              className="border-t hover:bg-slate-50 transition"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-5 py-4 text-slate-700">
                  {String((row as any)[col.key] ?? "")}
                </td>
              ))}

              {actions && (
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={`
                          text-sm font-medium underline-offset-2 hover:underline
                          ${
                            action.label.toLowerCase().includes("delete")
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

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-4 border-t bg-slate-50">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows per page:</span>
          <select
            value={effectiveLimit}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-300 px-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm text-slate-600">
          Page {effectivePage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrevious}
            disabled={effectivePage === 1}
            className="px-3 py-1 text-sm rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={goNext}
            disabled={effectivePage === totalPages}
            className="px-3 py-1 text-sm rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
