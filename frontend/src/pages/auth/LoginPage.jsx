import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  Users,
  CheckCircle2,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
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
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { logo, settings } = useCollegeSettings();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = ROLE_DASHBOARD[user.role] || "/";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      const destination = ROLE_DASHBOARD[user.role] || "/";
      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password. Please try again.";
      toast.error(message);
    }
  };

  // Quick fill helper for testing
  const fillCredentials = (email, password) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ── LEFT PANEL: Modern College Campus & Student Visual (lg+) ── */}
      <div className="lg:w-1/2 relative overflow-hidden text-white flex flex-col justify-between p-8 lg:p-14 min-h-[520px] lg:min-h-screen">
        
        {/* Authentic College Photograph Background */}
        <img
          src="/images/hero-students.jpg"
          alt="Nalanda College Students"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Cinematic Multi-Layer Gradient Overlays (Replaces flat color) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />
        
        {/* Subtle Ambient Glows matching Homepage theme */}
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
                Patliputra University Unit
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
            <span className="text-lg">🚀</span>
            <div className="flex items-center gap-1.5 text-xs font-black font-kapra tracking-wider uppercase">
              <span className="text-slate-950 dark:text-white">ATTEND.</span>
              <span className="text-[#0038ff] dark:text-[#4d77ff]">LEARN.</span>
              <span className="text-amber-500">REPEAT.</span>
            </div>
          </div>

          {/* Headline inspired by Homepage */}
          <h1 className="text-slate-100 font-kapra tracking-tight sm:tracking-[-1px] leading-[0.92] text-4xl sm:text-5xl lg:text-6xl uppercase mb-4">
            SMART CAMPUS <br />
            <span className="text-[#4d77ff] drop-shadow-lg">NALANDA.</span>
          </h1>

          {/* Subtitle with the iconic yellow highlight chips */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-poppins">
            Stay on track with{" "}
            <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">
              smart attendance
            </span>
            ,{" "}
            <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">
              academic records
            </span>
            , and real-time university coordination.
          </p>

          {/* Frosted Glass Stats Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/15 shadow-2xl">
            <div className="text-center">
              <p className="text-2xl font-black text-white font-kapra tracking-tight">120+</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Enrolled BCA</p>
            </div>
            <div className="text-center border-x border-white/15">
              <p className="text-2xl font-black text-amber-400 font-kapra tracking-tight">75%</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Univ. Target</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-400 font-kapra tracking-tight">99.8%</p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">Live Sync</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex flex-col text-xs text-slate-400 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-slate-300">BCA-III Academic Session 2024-25</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">v1.0 ERP</span>
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

      {/* ── RIGHT PANEL: Clean, High-Contrast Modern Auth Form ── */}
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

        <div className="w-full max-w-md space-y-6">
          
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
                  Attendance & Academic Portal
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0038ff]/10 dark:bg-[#0038ff]/20 border border-[#0038ff]/30 text-[#0038ff] dark:text-[#6d92ff] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0038ff] dark:text-[#6d92ff]" />
              <span>Secure University Portal</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display">
              Welcome back
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Sign in to manage classes, attendance records, and exams.
            </p>
          </div>

          {/* Quick test credentials */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Accounts:
              </span>
              <span className="text-[10px] text-slate-400">One-click fill</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@nalanda.edu", "Admin@1234")}
                className="px-2 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-all cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("rajesh@nalanda.edu", "Teacher@1234")}
                className="px-2 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-all cursor-pointer text-center truncate"
                title="Teacher (Dr. Rajesh)"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("md.014@nalanda.edu", "Student@123")}
                className="px-2 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-all cursor-pointer text-center truncate"
                title="Student (Md Huzaifa)"
              >
                Student
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@nalanda.edu"
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

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <span className="text-xs font-semibold text-[#0038ff] dark:text-[#6d92ff] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-[#0038ff] hover:bg-[#002ecc] dark:bg-[#0038ff] dark:hover:bg-[#2052ff] shadow-lg shadow-[#0038ff]/30 hover:shadow-xl hover:shadow-[#0038ff]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#0038ff] dark:text-[#6d92ff] hover:underline"
            >
              Create student account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

