import { useEffect, useMemo, useState } from "react";
import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

import {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
  type UserItem,
} from "../services/userService";
import { listDepartments } from "../../department/services/departmentService";
import { listDesignations } from "../../designation/services/designationService";
import { getSession } from "../../auth/services/auth";
import Loader from "../../../components/ui/Loader";

type Row = {
  id: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  status: string;
};

const Users = () => {
  const { user } = getSession();
  const isSuperAdmin = user?.role === "superadmin";

  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0); // ✅ total items from backend

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  const [addOpen, setAddOpen] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee" as "superadmin" | "admin" | "employee",
    departmentId: "",
    designationId: "",
  });

  const [deptOptions, setDeptOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [desigOptions, setDesigOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const [formError, setFormError] = useState("");

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<Row | null>(null);

  const columns: Column<Row>[] = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      {
        key: "status",
        label: "Status",
        render: (value, row) => (
          <select
            value={value}
            onChange={async (e) => {
              try {
                await updateUser(row._id, {
                  name: row.name,
                  email: row.email,
                  role: row.role as "superadmin" | "admin" | "employee",
                  departmentId: "",
                  designationId: "",
                  status: e.target.value as "Active" | "Inactive",
                });

                load();
              } catch {
                setErrorMsg("Status update failed");
                setErrorOpen(true);
              }
            }}
            className="border rounded px-2 py-1"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        ),
      },
    ],
    [],
  );
  const actions = [
    {
      label: "View",
      onClick: (row: Row) => {
        openView(row);
      },
    },
    {
      label: "Edit",
      onClick: (row: Row) => {
        openEdit(row);
      },
    },
    {
      label: "Delete",
      onClick: (row: Row) => {
        setSelectedUserId(row._id);
        setDeleteOpen(true);
      },
    },
  ];
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({ page, limit, search });

      const mapped: Row[] = res.items.map((u: UserItem, idx) => ({
        id: idx + 1 + (page - 1) * limit,
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department ?? "",
        designation: u.designation ?? "",
        status: u.status ?? "Active",
      }));

      setRows(mapped);
      setTotal(res.total ?? 0); // ✅ use backend total
    } catch (e: unknown) {
      let message = "Failed to fetch users";
      if (e instanceof Error) message = e.message;
      else if (typeof e === "string") message = e;
      setErrorMsg(message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!form.departmentId) {
      setDesigOptions([]);
      setForm((p) => ({ ...p, designationId: "" }));
      return;
    }

    const loadDesignations = async () => {
      const res = await listDesignations({
        page: 1,
        limit: 1000,
        departmentId: form.departmentId, // ✅ pass department
      });

      setDesigOptions(
        res.items.map((d) => ({
          id: d.id,
          name: d.name,
        })),
      );
    };

    loadDesignations();
  }, [form.departmentId]);
  const loadDropdowns = async () => {
    try {
      const dep = await listDepartments({ page: 1, limit: 1000 });
      setDeptOptions(dep.items.map((d) => ({ id: d.id, name: d.name })));

      const des = await listDesignations({ page: 1, limit: 1000 });
      setDesigOptions(des.items.map((d) => ({ id: d.id, name: d.name })));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (addOpen) loadDropdowns();
  }, [addOpen]);

  const openAdd = () => {
    setFormError("");

    setForm({
      name: "",
      email: "",
      role: "employee",
      departmentId: "",
      designationId: "",
    });

    setEditingUserId(null);
    setIsEditMode(false);

    setAddOpen(true);
  };
  const openView = (row: Row) => {
    setViewUser(row);
    setViewOpen(true);
  };
  const openEdit = (row: Row) => {
    setFormError("");

    setForm({
      name: row.name,
      email: row.email,
      role: row.role as "superadmin" | "admin" | "employee",
      departmentId: "",
      designationId: "",
    });

    setEditingUserId(row._id);
    setIsEditMode(true);
    setAddOpen(true);
  };
  const validateForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Valid email required";
    if (!form.departmentId) return "Department is required";
    if (!form.designationId) return "Designation is required";
    return "";
  };

  const saveUser = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    try {
      if (isEditMode && editingUserId) {
        await updateUser(editingUserId, {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          departmentId: form.departmentId,
          designationId: form.designationId,
          status: "Active",
        });

        setSuccessMsg("User updated successfully.");
      } else {
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          departmentId: form.departmentId,
          designationId: form.designationId,
        });

        setSuccessMsg("User created successfully.");
      }

      setAddOpen(false);
      setSuccessOpen(true);

      setPage(1);
      load();
    } catch (e: unknown) {
      let message = "Create user failed";
      if (e instanceof Error) message = e.message;
      else if (typeof e === "string") message = e;
      setErrorMsg(message);
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      await deleteUser(selectedUserId);

      setDeleteOpen(false);
      setSelectedUserId(null);

      setSuccessMsg("User deleted successfully.");
      setSuccessOpen(true);

      load();
    } catch {
      setErrorMsg("Delete failed");
      setErrorOpen(true);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Users</h2>
          <p className="text-sm text-slate-500">Manage users (Add / List)</p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Add User
        </button>
      </div>

      {/* ✅ ONLY Search (pagination duplicate removed) */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="h-11 w-full md:max-w-md rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {loading ? (
        <Loader
          variant="block"
          size="md"
          label="Loading assets..."
          className="mb-3"
        />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          actions={actions}
          serverPagination={{
            enabled: true,
            page,
            limit,
            total, // ✅ correct
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}

      <Modal
        open={addOpen}
        title={isEditMode ? "Edit User" : "Add User"}
        onClose={() => (saving ? null : setAddOpen(false))}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={() => setAddOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </Button>
            <Button
              onClick={saveUser}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}

          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                setFormError("");
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              value={form.email}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }));
                setFormError("");
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm((p) => ({
                  ...p,
                  role: e.target.value as "superadmin" | "admin" | "employee",
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="employee">employee</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Department
            </label>
            <select
              value={form.departmentId}
              onChange={(e) =>
                setForm((p) => ({ ...p, departmentId: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select department</option>
              {deptOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Designation
            </label>
            <select
              value={form.designationId}
              onChange={(e) =>
                setForm((p) => ({ ...p, designationId: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select designation</option>
              {desigOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
      <Modal
        open={viewOpen}
        title="User Details"
        onClose={() => setViewOpen(false)}
        footer={
          <div className="flex justify-end">
            <Button
              onClick={() => setViewOpen(false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
            >
              Close
            </Button>
          </div>
        }
      >
        {viewUser && (
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <b>Name:</b> {viewUser.name}
            </p>
            <p>
              <b>Email:</b> {viewUser.email}
            </p>
            <p>
              <b>Role:</b> {viewUser.role}
            </p>
            <p>
              <b>Department:</b> {viewUser.department}
            </p>
            <p>
              <b>Designation:</b> {viewUser.designation}
            </p>
            <p>
              <b>Status:</b> {viewUser.status}
            </p>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={successOpen}
        title="Success"
        message={successMsg}
        mode="Success"
        onConfirm={() => setSuccessOpen(false)}
        onCancel={() => setSuccessOpen(false)}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        mode="Confirm"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedUserId(null);
        }}
      />
      <ConfirmDialog
        open={errorOpen}
        title="Error"
        message={errorMsg}
        mode="Confirm"
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />
    </div>
  );
};

export default Users;
