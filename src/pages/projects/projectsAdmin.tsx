import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/table/DataTable";
import type { Column } from "../../components/table/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

import {
  listProjects,
  softDeleteProject,
  type ProjectStatus,
} from "../../services/projectService";

import ProjectFormModal from "./ProjectFormModal";
import ProjectViewModal from "./ProjectViewModal";
import { formatDate } from "../../utils/date";

type Row = {
  id: number; // DataTable needs number
  _id: string;
  name: string;
  startDate: string;
  timeLimit: string;
  status: ProjectStatus;
  employeesCount: string;
};

const ProjectsAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1); // backend pagination
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [rows, setRows] = useState<Row[]>([]);

  const [addOpen, setAddOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const columns: Column<Row>[] = useMemo(
    () => [
      { key: "name", label: "Project" },
      { key: "startDate", label: "Start Date" },
      { key: "timeLimit", label: "Time Limit" },
      { key: "status", label: "Status" },
      { key: "employeesCount", label: "Members" },
    ],
    []
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await listProjects({ page, limit });

      const mapped: Row[] = res.items.map((p, idx) => ({
        id: idx + 1 + (page - 1) * limit,
        _id: p._id,
        name: p.name,
        startDate: formatDate(p.startDate),
        timeLimit: p.timeLimit,
        status: p.status,
        employeesCount: String(p.employees?.length ?? 0),
      }));

      setRows(mapped);
      setTotalPages(res.totalPages || 1);
    } catch (e: unknown) {
        let message="Failed to fetch  projects"
        if(e instanceof Error){
            message=e.message
        }
        else if(typeof e==="string"){
            message=e
        }
      setErrorMsg(message );
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    // frontend search (current page only)
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, search]);

  /*const openView = (row: Row) => {
    setViewId(row._id);
    setViewOpen(true);
  };*/

  const openEdit = (row: Row) => {
    setEditId(row._id);
    setEditOpen(true);
  };

  const openDelete = (row: Row) => {
    setDeleteId(row._id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await softDeleteProject(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
      setSuccessMsg("Project deleted successfully.");
      setSuccessOpen(true);
      load();
    } catch (e: unknown) {
        let message="Delete Failed"
        if(e instanceof Error){
            message=e.message
        }
        else if(typeof e==="string"){
            message=e
        }
      setErrorMsg(message);
      setErrorOpen(true);
    }
  };
  const openProject = (row: Row) => {
  navigate(`/projects/${row._id}`);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Projects
          </h2>
          <p className="text-sm text-slate-500">
            Create, view, edit and soft-delete projects
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Add Project
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name..."
          className="h-11 w-full md:max-w-md rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-200"
        />

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
          Loading projects...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRows}
          actions={[
            { label: "View", onClick: openProject },
            { label: "Edit", onClick: openEdit },
            { label: "Delete", onClick: openDelete },
          ]}
        />
      )}

      {/* Modals */}
      <ProjectFormModal
        open={addOpen}
        mode="add"
        projectId={null}
        onClose={() => setAddOpen(false)}
        onSuccess={() => {
          setAddOpen(false);
          setSuccessMsg("Project created successfully.");
          setSuccessOpen(true);
          load();
        }}
      />

      <ProjectFormModal
        open={editOpen}
        mode="edit"
        projectId={editId}
        onClose={() => {
          setEditOpen(false);
          setEditId(null);
        }}
        onSuccess={() => {
          setEditOpen(false);
          setEditId(null);
          setSuccessMsg("Project updated successfully.");
          setSuccessOpen(true);
          load();
        }}
      />

      <ProjectViewModal
        open={viewOpen}
        projectId={viewId}
        onClose={() => {
          setViewOpen(false);
          setViewId(null);
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? (Soft delete)"
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />

      {/* Success */}
      <ConfirmDialog
        open={successOpen}
        title="Success"
        message={successMsg}
        mode="Success"
        onConfirm={() => setSuccessOpen(false)}
        onCancel={() => setSuccessOpen(false)}
      />

      {/* Error */}
      <ConfirmDialog
        open={errorOpen}
        title="Error"
        message={errorMsg}
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />
    </div>
  );
};

export default ProjectsAdmin;