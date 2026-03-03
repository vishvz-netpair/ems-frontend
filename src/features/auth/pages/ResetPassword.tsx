import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { InputField } from "../../../components/ui/InputField";
import { apiRequest } from "../../../services/api";

type FormData = { password: string; confirmPassword: string };

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // token missing => invalid link
    if (!token) {
      setIsSuccess(false);
      setDialogMessage(
        "Invalid or missing reset token. Please request a new link.",
      );
      setDialogOpen(true);
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      await apiRequest<{ message: string }>(
        "/api/auth/reset-password",
        "POST",
        { token, newPassword: data.password },
      );

      setIsSuccess(true);
      setDialogMessage("Password updated. Please login.");
      setDialogOpen(true);
    } catch (e: unknown) {
      let message = "Reset failed";
      if (e instanceof Error) message = e.message;
      else if (typeof e === "string") message = e;

      setIsSuccess(false);
      setDialogMessage(message);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setDialogOpen(false);
    if (isSuccess) navigate("/", { replace: true });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-slate-950 p-8 rounded-2xl shadow-2xl w-[420px] border border-slate-700">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Reset Password
          </h2>
          <p className="text-center text-slate-300 text-sm mb-8">
            Set your new password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <InputField
                  type="password"
                  placeholder="New password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  className="bg-slate-800 border-slate-600 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: "Confirm password is required" }}
              render={({ field }) => (
                <InputField
                  type="password"
                  placeholder="Confirm new password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.confirmPassword?.message}
                  className="bg-slate-800  border-slate-600 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <Button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title={isSuccess ? "Success" : "Error"}
        message={dialogMessage}
        mode={isSuccess ? "Success" : "Confirm"}
        onConfirm={close}
        onCancel={close}
      />
    </>
  );
}
