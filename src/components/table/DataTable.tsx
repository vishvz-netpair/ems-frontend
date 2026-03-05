import { useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
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
  serverPagination?: ServerPagination;
};

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  actions,
  serverPagination,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isServer = !!serverPagination?.enabled;

  const totalItems = isServer ? serverPagination.total : data.length;
  const effectiveLimit = isServer ? serverPagination.limit : rowsPerPage;
  const totalPages = Math.ceil(totalItems / effectiveLimit) || 1;

  const effectivePage = isServer
    ? serverPagination.page
    : Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (isServer) return data;
    const start = (effectivePage - 1) * effectiveLimit;
    return data.slice(start, start + effectiveLimit);
  }, [data, isServer, effectivePage, effectiveLimit]);

  const goPrevious = () => {
    if (effectivePage <= 1) return;
    if (isServer) serverPagination.onPageChange(effectivePage - 1);
    else setCurrentPage((p) => p - 1);
  };

  const goNext = () => {
    if (effectivePage >= totalPages) return;
    if (isServer) serverPagination.onPageChange(effectivePage + 1);
    else setCurrentPage((p) => p + 1);
  };

  const handleLimitChange = (value: number) => {
    if (isServer) {
      serverPagination.onLimitChange(value);
      serverPagination.onPageChange(1);
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
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td
                    key={String(col.key)}
                    className="px-5 py-4 text-slate-700"
                  >
                    {col.render ? col.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}

              {actions && (
                <td className="px-5 py-4 text-center">
                  <div className="flex gap-3 justify-center">
                    {actions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => a.onClick(row)}
                        className={`text-sm underline ${
                          a.label.toLowerCase().includes("delete")
                            ? "text-red-600"
                            : "text-indigo-600"
                        }`}
                      >
                        {a.label}
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

      <div className="flex justify-between items-center px-5 py-4 border-t bg-slate-50">
        <div className="flex items-center gap-2 text-sm">
          Rows:
          <select
            value={effectiveLimit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm">
          Page {effectivePage} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            onClick={goPrevious}
            disabled={effectivePage === 1}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={effectivePage === totalPages}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
