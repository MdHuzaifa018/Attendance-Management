import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, GraduationCap, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

// -------------------------------------------------------------------
// Zod schema — password confirmation via .refine()
// -------------------------------------------------------------------
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
    path: ["confirmPassword"], // attach error to confirmPassword field
  });

// -------------------------------------------------------------------
// Reusable field error component
// -------------------------------------------------------------------
const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  ) : null;

// -------------------------------------------------------------------
// RegisterPage
// -------------------------------------------------------------------
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
      // Public registration always creates a student account (enforced on backend too)
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created! Welcome to Nalanda Attendance System.");
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm
     focus:outline-none focus:ring-2 transition-colors
     ${
       hasError
         ? "border-red-500 focus:ring-red-500"
         : "border-slate-700 hover:border-slate-600 focus:ring-indigo-500"
     }`;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

          {/* Heading */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create student account
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Nalanda College Attendance System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Full name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                {...register("name")}
                className={inputClass(!!errors.name)}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={inputClass(!!errors.email)}
              />
              <FieldError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  {...register("password")}
                  className={inputClass(!!errors.password) + " pr-10"}
                />
                <button
                  type="button"
                  id="reg-toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  className={inputClass(!!errors.confirmPassword) + " pr-10"}
                />
                <button
                  type="button"
                  id="reg-toggle-confirm"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* Note: role is always student */}
            <p className="text-xs text-slate-500 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
              Student accounts only. Admin / Teacher accounts are created by the administrator.
            </p>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-1
                bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create account
                </>
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          College Attendance Management System · Nalanda College
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
