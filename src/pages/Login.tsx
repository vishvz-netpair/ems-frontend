import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ConfirmDialog from "../components/common/ConfirmDialog";

type User={
  username:string;
  password:string;
};

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [dialogOpen,setDialogOpen]=useState(false)
  const [dialogMessage,setDialogMessage]=useState("")
  const [isSuccess,setIsSuccess]=useState(false)

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users:User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u) =>
        u.username === form.username && u.password === form.password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setDialogMessage("Login Successfull")
       setIsSuccess(true)
       setDialogOpen(true)

      //navigate("/dashboard");
    } else {
      setDialogMessage("Invalid username or password.");
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    if (isSuccess) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-slate-950 p-8 rounded-2xl shadow-2xl w-[400px] border border-slate-700">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            EMS Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
            >
              Login
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