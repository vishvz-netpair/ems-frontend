import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import DataTable from "../../../components/table/DataTable";
import type { Column } from "../../../components/table/DataTable";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import { Controller } from "react-hook-form";

import {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
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

type FormValues = {
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  departmentId: string;
  designationId: string;
};

const Users = () => {
  const { user } = getSession();
  const isSuperAdmin = user?.role === "superadmin";

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [saving, setSaving] = useState(false);
  const hasMountedSearch = useRef(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [deptOptions, setDeptOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [desigOptions, setDesigOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: "employee",
      departmentId: "",
      designationId: "",
    },
  });

  const departmentId = watch("departmentId");

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
                await updateUserStatus(
                  row._id,
                  e.target.value as "Active" | "Inactive",
                );

                setSuccessMsg("Status updated successfully");
                setSuccessOpen(true);
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
      label: "Edit",
      onClick: (row: Row) => openEdit(row),
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
      setTotal(res.total ?? 0);
    } catch (e) {
      console.log(e);
      setErrorMsg("Failed to fetch users");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    const dep = await listDepartments({ page: 1, limit: 1000 });
    setDeptOptions(dep.items.map((d) => ({ id: d.id, name: d.name })));

    const des = await listDesignations({ page: 1, limit: 1000 });
    setDesigOptions(des.items.map((d) => ({ id: d.id, name: d.name })));
  };

  useEffect(() => {
    if (!departmentId) return;

    const loadDesignations = async () => {
      const res = await listDesignations({
        page: 1,
        limit: 1000,
        departmentId,
      });

      setDesigOptions(res.items.map((d) => ({ id: d.id, name: d.name })));
    };

    loadDesignations();
  }, [departmentId]);

  useEffect(() => {
    load();
  }, [page, limit]);

  useEffect(() => {
    if (!hasMountedSearch.current) {
      hasMountedSearch.current = true;
      return;
    }

    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (addOpen) loadDropdowns();
  }, [addOpen]);

  const openAdd = () => {
    reset({
      name: "",
      email: "",
      role: "employee",
      departmentId: "",
      designationId: "",
    });

    setEditingUserId(null);
    setAddOpen(true);
  };

  const openEdit = (row: Row) => {
    reset({
      name: row.name,
      email: row.email,
      role: row.role as "superadmin" | "admin" | "employee",
      departmentId: "",
      designationId: "",
    });

    setEditingUserId(row._id);
    setAddOpen(true);
  };

  /* const onSubmit = async (data: FormValues) => {
    setSaving(true);

    try {
      if (editingUserId) {
        await updateUser(editingUserId, {
          ...data,
          status: "Active",
        });

        setSuccessMsg("User updated successfully.");
      } else {
        await createUser(data);
        setSuccessMsg("User created successfully.");
      }

      setAddOpen(false);
      setSuccessOpen(true);

      setPage(1);
      load();
    } catch {
      setErrorMsg("Save failed");
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  };*/
  const onSubmit = async (data: FormValues) => {
    if (!data.departmentId) {
      setErrorMsg("Department is required");
      setErrorOpen(true);
      return;
    }

    if (!data.designationId) {
      setErrorMsg("Designation is required");
      setErrorOpen(true);
      return;
    }

    setSaving(true);

    try {
      if (editingUserId) {
        await updateUser(editingUserId, {
          name: data.name.trim(),
          email: data.email.trim(),
          role: data.role,
          departmentId: data.departmentId,
          designationId: data.designationId,
          status: "Active",
        });

        setSuccessMsg("User updated successfully");
      } else {
        await createUser({
          name: data.name.trim(),
          email: data.email.trim(),
          role: data.role,
          departmentId: data.departmentId,
          designationId: data.designationId,
        });

        setSuccessMsg("User created successfully");
      }

      setAddOpen(false);
      setSuccessOpen(true);

      load();
    } catch (err) {
      setErrorMsg("User save failed");
      setErrorOpen(true);
      console.log(err);
    } finally {
      setSaving(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedUserId) return;

    await deleteUser(selectedUserId);

    setDeleteOpen(false);
    setSelectedUserId(null);

    setSuccessMsg("User deleted successfully.");
    setSuccessOpen(true);

    load();
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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full items-center gap-3 lg:max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <Button onClick={openAdd} size="lg">
          Add User
        </Button>
      </div>

      {loading ? (
        <Loader variant="block" size="md" label="Loading users..." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          actions={actions}
          serverPagination={{
            enabled: true,
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
        />
      )}

      <Modal
        open={addOpen}
        title={editingUserId ? "Edit User" : "Add User"}
        onClose={() => setAddOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <InputField
                label="Name"
                value={field.value}
                onChange={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <InputField
                label="Email"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label="Role"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: "Employee", value: "employee" },
                  { label: "Admin", value: "admin" },
                  { label: "Superadmin", value: "superadmin" },
                ]}
              />
            )}
          />

          <Controller
            name="departmentId"
            control={control}
            rules={{ required: "Department required" }}
            render={({ field }) => (
              <SelectDropdown
                label="Department"
                value={field.value}
                onChange={field.onChange}
                options={deptOptions.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
                error={errors.departmentId?.message}
              />
            )}
          />

          <Controller
            name="designationId"
            control={control}
            rules={{ required: "Designation required" }}
            render={({ field }) => (
              <SelectDropdown
                label="Designation"
                value={field.value}
                onChange={field.onChange}
                options={desigOptions.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
                error={errors.designationId?.message}
              />
            )}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" isLoading={saving}>
              {editingUserId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={successOpen}
        title="Success"
        message={successMsg}
        mode="Success"
        onConfirm={() => setSuccessOpen(false)}
        onCancel={() => setSuccessOpen(false)}
      />

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

export default Users;
