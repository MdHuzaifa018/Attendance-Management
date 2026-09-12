import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  AlertCircle,
  Loader2,
  Shield,
  Users,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";

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

const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      const from =
        location.state?.from?.pathname || ROLE_DASHBOARD[user.role] || "/";
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password. Please try again.";
      toast.error(message);
    }
  };

  // Quick fill helper for testing
  const fillDemo = (email, password) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ── LEFT PANEL: Modern Tech Gradient Showcase (Visible on lg+) ── */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 text-white p-8 lg:p-14 flex flex-col justify-between">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient glow orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Nalanda College
            </h2>
            <p className="text-xs text-white/80 font-medium">
              Attendance & Academic Portal
            </p>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/30 flex items-center justify-center shadow-2xl mb-8 transform hover:scale-105 transition-transform">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Nalanda College
          </h1>

          <p className="text-white/90 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
            Smart Attendance & Academic Management System. Real-time tracking,
            accurate records, and seamless coordination between faculty,
            students, and administration.
          </p>

          {/* Key Metrics / Highlights */}
          <div className="w-full grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">120+</p>
              <p className="text-xs text-white/80 mt-0.5">Students</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-2xl font-extrabold text-white">179+</p>
              <p className="text-xs text-white/80 mt-0.5">Classes Engaged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">99.8%</p>
              <p className="text-xs text-white/80 mt-0.5">Real-time</p>
            </div>
          </div>
        </div>

        {/* Bottom footer badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/70">
          <span>BCA-III Academic Session 2024-25</span>
          <span>Version 1.0</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Clean, High-Contrast Auth Box ── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        {/* Top-Right Theme Toggle */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 mb-4">
              <Shield className="w-3.5 h-3.5" /> Secure Portal Access
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Sign in to access your attendance and academic dashboard.
            </p>
          </div>

          {/* Quick demo fill buttons */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Quick Demo Fill:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@nalanda.edu", "Admin@1234")}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo("rajesh@nalanda.edu", "Teacher@1234")}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                Teacher (Dr. Rajesh)
              </button>
              <button
                type="button"
                onClick={() => fillDemo("huzaifa@bca.edu", "Student@1234")}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                Student (Md Huzaifa)
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@nalanda.edu"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                      : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-indigo-600/20"
                  }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-indigo-600/20"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
