import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { InputField } from "../../../components/ui/InputField";
import { apiRequest } from "../../../services/api";

type FormData = { email: string };

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "" },
  });

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await apiRequest<{ message: string }>(
        "/api/auth/forgot-password",
        "POST",
        { email: data.email },
      );

      setIsSuccess(true);
      setDialogMessage(
        "Reset link sent to your email. Please check inbox/spam.",
      );
      setDialogOpen(true);
    } catch (e: unknown) {
      let message = "Failed to send reset link";
      if (e instanceof Error) message = e.message;
      else if (typeof e === "string") message = e;

      setIsSuccess(false);
      setDialogMessage(message);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const close = () => setDialogOpen(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-slate-950 p-8 rounded-2xl shadow-2xl w-[420px] border border-slate-700">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Forgot Password
          </h2>
          <p className="text-center text-slate-300 text-sm mb-8">
            Enter your email and we’ll send a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <InputField
                  type="email"
                  placeholder="Email"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.email?.message}
                  className="bg-slate-800 border-slate-600 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
