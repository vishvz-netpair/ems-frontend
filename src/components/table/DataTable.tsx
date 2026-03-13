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
    <div className="min-w-0 overflow-hidden rounded-[28px] border border-[rgba(123,97,63,0.12)] bg-[rgba(255,253,248,0.92)] shadow-[0_18px_40px_rgba(33,29,22,0.08)]">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-[linear-gradient(180deg,rgba(15,118,110,0.06),rgba(255,253,248,0.96))]">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-5 py-4 text-left text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-5 py-4 text-center text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={String(row.id)}
              className="border-t border-[rgba(123,97,63,0.1)] transition hover:bg-white/75"
            >
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td
                    key={String(col.key)}
                    className="break-words px-5 py-4 leading-6 text-slate-700"
                  >
                    {col.render ? col.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}

              {actions && (
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {actions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => a.onClick(row)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold leading-none transition ${
                          a.label.toLowerCase().includes("delete")
                            ? "text-red-600 hover:bg-red-50"
                            : "text-teal-700 hover:bg-teal-50"
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(123,97,63,0.1)] bg-[rgba(250,247,241,0.82)] px-5 py-4">
        <div className="flex items-center gap-2 text-sm leading-6">
          Rows:
          <select
            value={effectiveLimit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="rounded-xl border border-[rgba(123,97,63,0.16)] bg-white/90 px-3 py-1.5 shadow-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm leading-6">
          Page {effectivePage} of {totalPages}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={goPrevious}
            disabled={effectivePage === 1}
            className="rounded-xl border border-[rgba(123,97,63,0.16)] bg-white/90 px-3.5 py-1.5 font-medium leading-none transition hover:bg-white disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={effectivePage === totalPages}
            className="rounded-xl border border-[rgba(123,97,63,0.16)] bg-white/90 px-3.5 py-1.5 font-medium leading-none transition hover:bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
