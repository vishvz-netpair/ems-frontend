import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import type { LeaveTypeItem, LeaveTypePayload } from "../services/leaveService";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  initial?: LeaveTypeItem | null;
  onClose: () => void;
  onSave: (payload: LeaveTypePayload) => Promise<void> | void;
};

type FormValues = LeaveTypePayload;

const defaultValues: FormValues = {
  name: "",
  code: "",
  description: "",
  color: "#2563eb",
  totalAllocation: 12,
  allocationPeriod: "yearly",
  carryForwardEnabled: false,
  maxCarryForwardLimit: 0,
  accrualEnabled: false,
  accrualAmount: 0,
  accrualFrequency: "monthly",
  approvalWorkflowType: "two_level",
  maxDaysPerRequest: 5,
  minNoticeDays: 0,
  allowPastDates: false,
  requiresAttachment: false,
  status: "Active",
};

export default function LeaveTypeModal({ open, mode, initial, onClose, onSave }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
    mode: "onChange",
  });

  const carryForwardEnabled = watch("carryForwardEnabled");
  const accrualEnabled = watch("accrualEnabled");

  useEffect(() => {
    if (!open) return;
    reset(initial ? { ...initial } : defaultValues);
  }, [open, initial, reset]);

  const submit = async (values: FormValues) => {
    await onSave({
      ...values,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <Modal
      open={open}
      title={mode === "add" ? "Add Leave Type" : "Edit Leave Type"}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="leave-type-form" isLoading={isSubmitting}>
            {mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      }
    >
      <form id="leave-type-form" onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Leave name is required" }}
            render={({ field }) => (
              <InputField label="Leave Name" value={field.value} onChange={field.onChange} error={errors.name?.message} />
            )}
          />
          <Controller
            name="code"
            control={control}
            rules={{ required: "Code is required" }}
            render={({ field }) => (
              <InputField label="Code / Short Name" value={field.value} onChange={field.onChange} error={errors.code?.message} />
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <label className="mb-1.5 block text-sm font-medium text-slate-900">Description</label>
              <textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-slate-900">Badge Color</label>
                <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
                  <input type="color" value={field.value} onChange={(e) => field.onChange(e.target.value)} className="h-7 w-10 rounded border-0 bg-transparent p-0" />
                  <span className="text-sm text-slate-600">{field.value}</span>
                </div>
              </div>
            )}
          />
          <Controller
            name="totalAllocation"
            control={control}
            rules={{ required: "Allocation required", min: { value: 0, message: "Minimum 0" } }}
            render={({ field }) => (
              <InputField
                label="Total Allocation"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.totalAllocation?.message}
              />
            )}
          />
          <Controller
            name="maxDaysPerRequest"
            control={control}
            rules={{ required: "Max days required", min: { value: 0.5, message: "Minimum 0.5" } }}
            render={({ field }) => (
              <InputField
                label="Max Days / Request"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.maxDaysPerRequest?.message}
              />
            )}
          />
          <Controller
            name="minNoticeDays"
            control={control}
            render={({ field }) => (
              <InputField
                label="Min Notice Days"
                type="number"
                value={String(field.value ?? 0)}
                onChange={(value) => field.onChange(Number(value))}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="allocationPeriod"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label="Allocation Period"
                value={field.value}
                onChange={(value) => field.onChange(value as FormValues["allocationPeriod"])}
                options={[
                  { label: "Yearly", value: "yearly" },
                  { label: "Monthly", value: "monthly" },
                ]}
              />
            )}
          />
          <Controller
            name="approvalWorkflowType"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label="Approval Workflow"
                value={field.value}
                onChange={(value) => field.onChange(value as FormValues["approvalWorkflowType"])}
                options={[
                  { label: "Two Level", value: "two_level" },
                  { label: "Single Level", value: "single_level" },
                ]}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label="Status"
                value={field.value}
                onChange={(value) => field.onChange(value as FormValues["status"])}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            )}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="carryForwardEnabled"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">Carry Forward Enabled</span>
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                </label>
              )}
            />
            <Controller
              name="accrualEnabled"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">Monthly Accrual Enabled</span>
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                </label>
              )}
            />
            <Controller
              name="allowPastDates"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">Allow Past Date Apply</span>
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                </label>
              )}
            />
            <Controller
              name="requiresAttachment"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">Attachment Required</span>
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                </label>
              )}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="maxCarryForwardLimit"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Max Carry Forward"
                  type="number"
                  disabled={!carryForwardEnabled}
                  value={String(field.value ?? 0)}
                  onChange={(value) => field.onChange(Number(value))}
                />
              )}
            />
            <Controller
              name="accrualAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Accrual Amount"
                  type="number"
                  disabled={!accrualEnabled}
                  value={String(field.value ?? 0)}
                  onChange={(value) => field.onChange(Number(value))}
                />
              )}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
