import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, GraduationCap, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

// -------------------------------------------------------------------
// Zod schema — frontend validation mirrors backend validator rules
// -------------------------------------------------------------------
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// -------------------------------------------------------------------
// Role → dashboard path mapping
// -------------------------------------------------------------------
const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

// -------------------------------------------------------------------
// LoginPage
// -------------------------------------------------------------------
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      // login() calls POST /api/auth/login and stores the JWT
      const user = await login(data.email, data.password);

      toast.success(`Welcome back, ${user.name}!`);

      // If the user was redirected here from a protected page, go back there.
      // Otherwise go to the role dashboard.
      const from =
        location.state?.from?.pathname || ROLE_DASHBOARD[user.role] || "/";

      navigate(from, { replace: true });
    } catch (error) {
      // Axios wraps the response error; the backend sends { success, message }
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background subtle gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

          {/* Logo / heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Nalanda College Attendance System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-700 hover:border-slate-600"}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full px-4 py-2.5 pr-10 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
                    ${errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-700 hover:border-slate-600"}`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2
                bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-lg transition-colors focus:outline-none
                focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400">
            New student?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-4">
          College Attendance Management System · Nalanda College
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
