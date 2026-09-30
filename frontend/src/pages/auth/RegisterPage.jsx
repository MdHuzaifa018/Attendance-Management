import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
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
  const { logo, settings } = useCollegeSettings();
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
      
      {/* ── LEFT PANEL: Modern College Campus & Student Visual (lg+) ── */}
      <div className="lg:w-1/2 relative overflow-hidden text-white flex flex-col justify-between p-8 lg:p-14 min-h-[520px] lg:min-h-screen">
        
        {/* Authentic College Photograph Background */}
        <img
          src="/images/hero-students.jpg"
          alt="Nalanda College Students"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Cinematic Multi-Layer Gradient Overlays (Replaces flat color) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />

        {/* Ambient Glows matching Homepage theme */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#0038ff]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Header & Navigation */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/95 p-1 shadow-xl flex items-center justify-center border border-white/40">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-white leading-tight">
                {settings?.collegeName || "Nalanda College"}
              </h2>
              <p className="text-[11px] text-amber-300 font-semibold tracking-wide">
                Student Onboarding Portal
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white transition-all border border-white/20 shadow-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </Link>
        </div>

        {/* Centerpiece: Homepage-aligned Hero Content */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          
          {/* Floating Homepage Sticker: ATTEND. LEARN. REPEAT. */}
          <div className="inline-flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 text-slate-950 dark:text-white px-3.5 py-1.5 rounded-2xl border-2 border-slate-950 dark:border-slate-700 shadow-2xl mb-6 -rotate-2 hover:rotate-0 transition-transform">
            <span className="text-lg">⚡</span>
            <div className="flex items-center gap-1.5 text-xs font-black font-kapra tracking-wider uppercase">
              <span className="text-slate-950 dark:text-white">ATTEND.</span>
              <span className="text-[#0038ff] dark:text-[#4d77ff]">LEARN.</span>
              <span className="text-amber-500">REPEAT.</span>
            </div>
          </div>

          <h1 className="text-slate-100 font-kapra tracking-tight sm:tracking-[-1px] leading-[0.92] text-4xl sm:text-5xl lg:text-6xl uppercase mb-4">
            JOIN NALANDA <br />
            <span className="text-[#4d77ff] drop-shadow-lg">PORTAL.</span>
          </h1>

          {/* Subtitle with the iconic yellow highlight chips */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-poppins">
            Create your official student account to track{" "}
            <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">
              subject attendance
            </span>
            , maintain your{" "}
            <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">
              75% exam threshold
            </span>
            , and receive timetable alerts.
          </p>

          {/* Frosted Glass Stats Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/15 shadow-2xl">
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400 font-kapra tracking-tight">75%+</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Target Minimum</p>
            </div>
            <div className="text-center border-x border-white/15">
              <p className="text-2xl font-black text-white font-kapra tracking-tight">Live</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Daily Logs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-400 font-kapra tracking-tight">Direct</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Faculty Sync</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex flex-col text-xs text-slate-400 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-slate-300">BCA Department · Nalanda College</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">Student Access</span>
          </div>
          <div className="mt-2 text-left text-slate-400 text-[11px]">
            Developed with <span className="text-red-400">❤</span> by{" "}
            <a
              href="https://latest-portfolio-huzaif-sheikh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-300 transition-colors font-semibold underline underline-offset-2"
            >
              Md Huzaifa
            </a>
          </div>
        </div>

      </div>

      {/* ── RIGHT PANEL: Clean Modern Registration Form ── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 pb-24 sm:p-10 sm:pb-24 lg:p-14 relative bg-slate-50 dark:bg-slate-950">
        
        {/* Top Floating Controls */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <Link
            to="/"
            title="Go to Homepage"
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-5">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 lg:hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-sm"
              />
              <div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block leading-tight">
                  {settings?.collegeName || "Nalanda College"}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Student Registration Portal
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0038ff]/10 dark:bg-[#0038ff]/20 border border-[#0038ff]/30 text-[#0038ff] dark:text-[#6d92ff] mb-3">
              <UserCheck className="w-3.5 h-3.5 text-[#0038ff] dark:text-[#6d92ff]" />
              <span>Student Account Setup</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display">
              Create student account
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter your student details to register for the portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Md Huzaifa"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                    ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                    }`}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="student@nalanda.edu"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                    }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                    ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                    }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
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
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-[#0038ff] hover:bg-[#002ecc] dark:bg-[#0038ff] dark:hover:bg-[#2052ff] shadow-lg shadow-[#0038ff]/30 hover:shadow-xl hover:shadow-[#0038ff]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.99] mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Register Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#0038ff] dark:text-[#6d92ff] hover:underline"
            >
              Sign in to portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

