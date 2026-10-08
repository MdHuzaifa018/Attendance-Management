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
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
  Home,
  GraduationCap,
  Building2,
  Hash,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
import {
  getPublicDepartments,
  getPublicClasses,
} from "../../services/publicService.js";
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
    rollNo: z
      .string()
      .min(2, "College Roll Number is required")
      .max(30, "Roll number is too long")
      .trim(),
    departmentId: z.string().min(1, "Please select your department"),
    classId: z.string().min(1, "Please select your class / semester"),
    fatherName: z
      .string()
      .min(2, "Father's name is required")
      .max(100, "Father's name is too long")
      .trim(),
    phone: z
      .string()
      .min(10, "Please enter a valid 10-digit phone number")
      .max(15, "Phone number is too long")
      .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
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
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingAcademic, setLoadingAcademic] = useState(true);
  const [submittedData, setSubmittedData] = useState(null); // stores submitted application for success view

  const { register: registerUser } = useAuth();
  const { logo, settings } = useCollegeSettings();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      rollNo: "",
      departmentId: "",
      classId: "",
      fatherName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedDepartmentId = watch("departmentId");

  // Load departments on mount
  useEffect(() => {
    let cancelled = false;
    getPublicDepartments().then((deptList) => {
      if (!cancelled) {
        setDepartments(deptList || []);
        setLoadingAcademic(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch classes when department changes
  useEffect(() => {
    if (!selectedDepartmentId) {
      setClasses([]);
      setValue("classId", "");
      return;
    }

    let cancelled = false;
    getPublicClasses(selectedDepartmentId).then((classList) => {
      if (!cancelled) {
        setClasses(classList || []);
        setValue("classId", "");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDepartmentId, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        rollNo: data.rollNo,
        departmentId: data.departmentId,
        classId: data.classId,
        fatherName: data.fatherName,
        phone: data.phone,
      });

      const selectedDept = departments.find((d) => d._id === data.departmentId);
      const selectedCls = classes.find((c) => c._id === data.classId);

      setSubmittedData({
        name: data.name,
        email: data.email,
        rollNo: data.rollNo.toUpperCase(),
        departmentName: selectedDept?.name || "Department",
        className: selectedCls?.name || "Class",
        phone: data.phone,
      });

      toast.success(
        response?.message ||
          "Registration application submitted! Awaiting college approval."
      );
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
      {/* ── LEFT PANEL: Modern College Campus Visual ── */}
      <div className="lg:w-1/2 relative overflow-hidden text-white flex flex-col justify-between p-8 lg:p-14 min-h-[420px] lg:min-h-screen">
        <img
          src="/images/hero-students.jpg"
          alt="Nalanda College Students"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.85] contrast-[1.05]"
        />

        {/* Cinematic Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent" />

        {/* Ambient Glows matching Homepage theme */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#0038ff]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Header */}
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

        {/* Centerpiece Hero */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 text-slate-950 dark:text-white px-3.5 py-1.5 rounded-2xl border-2 border-slate-950 dark:border-slate-700 shadow-2xl mb-6 -rotate-2">
            <span className="text-lg">🏛️</span>
            <div className="flex items-center gap-1.5 text-xs font-black font-kapra tracking-wider uppercase">
              <span className="text-slate-950 dark:text-white">STUDENT</span>
              <span className="text-[#0038ff] dark:text-[#4d77ff]">ADMISSION</span>
              <span className="text-amber-500">PORTAL</span>
            </div>
          </div>

          <h1 className="text-slate-100 font-kapra tracking-tight sm:tracking-[-1px] leading-[0.92] text-4xl sm:text-5xl lg:text-6xl uppercase mb-4">
            JOIN DIGITAL <br />
            <span className="text-[#4d77ff] drop-shadow-lg">CAMPUS.</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-poppins">
            Apply for your student portal access with your college roll number
            and department details. Admin will verify and activate your ERP
            account.
          </p>

          {/* Frosted Glass Highlight Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/15 shadow-2xl">
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400 font-numbers tracking-wide">
                75<span className="font-sans font-bold text-lg ml-0.5">%+</span>
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                Target Minimum
              </p>
            </div>
            <div className="text-center border-x border-white/15">
              <p className="text-2xl font-black text-white font-numbers tracking-wide">
                Live
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                Attendance Sync
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-400 font-numbers tracking-wide">
                Verified
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                Admin Approval
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex flex-col text-xs text-slate-400 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-slate-300">
              Department of Computer Applications (BCA)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
              v1.1 ERP
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form or Success View ── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 pb-24 sm:p-10 sm:pb-24 lg:p-14 relative bg-slate-50 dark:bg-slate-950 overflow-y-auto max-h-screen">
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

        <div className="w-full max-w-lg space-y-5 my-auto py-8">
          {/* SUCCESS SCREEN IF APPLICATION SUBMITTED */}
          {submittedData ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-block mb-2">
                  Application Under Review
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  Registration Submitted!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Your application has been received by Nalanda College administration.
                  Once verified, your account will be activated for sign in.
                </p>
              </div>

              {/* Application Details Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Student Name:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {submittedData.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Roll Number:
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {submittedData.rollNo}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Department:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {submittedData.departmentName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/40">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Class / Semester:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {submittedData.className}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Status:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Admin Approval
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0038ff] hover:bg-[#002edb] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/"
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-center"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0038ff]/10 dark:bg-[#0038ff]/20 border border-[#0038ff]/30 text-[#0038ff] dark:text-[#6d92ff] mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-[#0038ff] dark:text-[#6d92ff]" />
                  <span>Student Self-Registration Portal</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display">
                  Student Registration Application
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Fill in your academic and personal details. Your account will be
                  verified and enrolled into your class by the admin.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                        ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                        }`}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* 2. Email & Roll Number in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      College / Personal Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="student@nalanda.edu"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                          ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-roll"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      College Roll Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-roll"
                        type="text"
                        placeholder="e.g. 24BCA015"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono font-bold uppercase transition-all focus:outline-none focus:ring-2
                          ${
                            errors.rollNo
                              ? "border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("rollNo")}
                      />
                    </div>
                    {errors.rollNo && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.rollNo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Department & Class Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-dept"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        id="reg-dept"
                        disabled={loadingAcademic}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer
                          ${
                            errors.departmentId
                              ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("departmentId")}
                      >
                        <option value="">
                          {loadingAcademic
                            ? "Loading departments..."
                            : "-- Select Department --"}
                        </option>
                        {departments.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.departmentId && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.departmentId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-class"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Class / Semester <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <select
                        id="reg-class"
                        disabled={!selectedDepartmentId || classes.length === 0}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer
                          ${
                            !selectedDepartmentId
                              ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800"
                              : errors.classId
                              ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] dark:focus:border-[#4d77ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("classId")}
                      >
                        <option value="">
                          {!selectedDepartmentId
                            ? "Select department first"
                            : classes.length === 0
                            ? "No classes available"
                            : "-- Select Class / Semester --"}
                        </option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} {c.section ? `(Sec ${c.section})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.classId && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.classId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Father Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-father"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="reg-father"
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                        ${
                          errors.fatherName
                            ? "border-red-500 bg-red-50/50 text-red-900"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] focus:ring-[#0038ff]/20"
                        }`}
                      {...register("fatherName")}
                    />
                    {errors.fatherName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        placeholder="9876543210"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                          ${
                            errors.phone
                              ? "border-red-500 bg-red-50/50 text-red-900"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                          ${
                            errors.password
                              ? "border-red-500 bg-red-50/50 text-red-900"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirm"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2
                          ${
                            errors.confirmPassword
                              ? "border-red-500 bg-red-50/50 text-red-900"
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#0038ff] focus:ring-[#0038ff]/20"
                          }`}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white text-sm bg-[#0038ff] hover:bg-[#002edb] active:scale-[0.99] transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Student Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom login link */}
              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an approved account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#0038ff] dark:text-[#4d77ff] hover:underline underline-offset-4"
                >
                  Sign in to Portal →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
