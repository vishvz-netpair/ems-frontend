import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import { saveSession } from "../services/auth";
import { InputField } from "../../../components/ui/InputField";

type LoginFormData = {
  email: string;
  password: string;
};

type JwtPayload = {
  id: string;
  role: "superadmin" | "admin" | "employee";
  iat: number;
  exp: number;
};

function decodeJwt(token: string): JwtPayload {
  const base64 = token.split(".")[1];
  const json = atob(base64);
  return JSON.parse(json);
}

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
      const res = await apiRequest<{ token: string; message: string }>(
        "/api/auth/login",
        "POST",
        {
          email: data.email,
          password: data.password,
        },
      );

      const payload = decodeJwt(res.token);

      saveSession({
        token: res.token,
        user: {
          email: data.email,
          id: payload.id,
          role: payload.role,
        },
      });

      setDialogMessage("Login Successful");
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (e: unknown) {
      let message = "Login Failed";
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

  // ✅ Success dialog should auto-close + redirect (no user confirmation)
  useEffect(() => {
    if (!dialogOpen || !isSuccess) return;
    const t = window.setTimeout(() => {
      setDialogOpen(false);
      navigate("/dashboard", { replace: true });
    }, 900);
    return () => window.clearTimeout(t);
  }, [dialogOpen, isSuccess, navigate]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-slate-950 p-8 rounded-2xl shadow-2xl w-[400px] border border-slate-700">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
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
                  className="bg-slate-800 border-slate-600 placeholder:text-slate-400 focus:ring-indigo-500"
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
                  className="bg-slate-800  border-slate-600 placeholder:text-slate-400 focus:ring-indigo-500"
                />
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-6">
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
