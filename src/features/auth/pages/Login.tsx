import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import { saveSession, type SessionUser, type UserRole } from "../services/auth";
import { InputField } from "../../../components/ui/InputField";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: SessionUser & { role: UserRole };
};

const Login = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await apiRequest<LoginResponse>("/api/auth/login", "POST", {
        email: data.email,
        password: data.password,
      });

      saveSession({
        token: res.token,
        user: {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        },
      });

      setDialogMessage("Login successful");
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (e: unknown) {
      let message = "Login failed";
      if (e instanceof Error) message = e.message;
      else if (typeof e === "string") message = e;

      setDialogMessage(message);
      setIsSuccess(false);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (isSuccess) navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (!dialogOpen || !isSuccess) return;
    const timeoutId = window.setTimeout(() => {
      setDialogOpen(false);
      navigate("/dashboard", { replace: true });
    }, 900);
    return () => window.clearTimeout(timeoutId);
  }, [dialogOpen, isSuccess, navigate]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-[400px] rounded-2xl border border-slate-700 bg-slate-950 p-8 shadow-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            EMS Login
          </h2>

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
                  className="border-slate-600 bg-slate-800 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <InputField
                  type="password"
                  placeholder="Password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  className="border-slate-600 bg-slate-800 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-slate-300 underline underline-offset-4 hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Contact HR for account credentials.
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title={isSuccess ? "Success" : "Login Failed"}
        message={dialogMessage}
        mode={isSuccess ? "Success" : "Confirm"}
        onConfirm={handleDialogClose}
        onCancel={handleDialogClose}
      />
    </>
  );
};

export default Login;
