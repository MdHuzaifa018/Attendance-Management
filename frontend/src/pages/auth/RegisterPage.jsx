import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  AlertCircle,
  Loader2,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created successfully! Welcome to Nalanda College.");
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ── LEFT PANEL: Tech Gradient Showcase (Visible on lg+) ── */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 text-white p-8 lg:p-14 flex flex-col justify-between">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Decorative ambient orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white/95 p-0.5 shadow-lg"
          />
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
          <img
            src="/logo.png"
            alt="Nalanda College ERP Logo"
            className="w-28 h-28 rounded-3xl object-contain bg-white/95 p-2 shadow-2xl mb-6 transform hover:scale-105 transition-transform"
          />

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Join Nalanda Portal
          </h1>

          <p className="text-white/90 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
            Create your student account to monitor daily subject attendance,
            receive threshold warnings, and stay on track for exam eligibility.
          </p>

          {/* Key Features */}
          <div className="w-full grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">75%+</p>
              <p className="text-xs text-white/80 mt-0.5">Target Minimum</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-2xl font-extrabold text-white">Live</p>
              <p className="text-xs text-white/80 mt-0.5">Daily Logs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">Direct</p>
              <p className="text-xs text-white/80 mt-0.5">Faculty Sync</p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/70">
          <span>Student Registration Portal</span>
          <span>Nalanda College, Biharsharif</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Clean Auth Box ── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        {/* Top-Right Theme Toggle */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded-xl object-contain bg-white/95 p-0.5 shadow-md"
              />
              <span className="font-bold text-sm text-slate-900 dark:text-white">Nalanda College</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 mb-4">
              <UserCheck className="w-3.5 h-3.5" /> Student Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create student account
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Enter your student details to register for the attendance portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Md Huzaifa"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                      : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-indigo-600/20"
                  }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="student@nalanda.edu"
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

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
                    ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-indigo-600/20"
                    }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
