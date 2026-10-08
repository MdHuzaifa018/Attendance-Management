import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2, KeyRound, User, BookOpen, Users, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  createStudent,
  updateStudent,
  getDepartments,
  getClassesByDepartment,
} from "../../services/studentService.js";
import { useSession } from "../../context/SessionContext.jsx";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select an option");

const createSchema = z.object({
  name:          z.string().min(2, "Name required").max(100).trim(),
  email:         z.string().email("Invalid email").trim(),
  password:      z.string().min(6, "Password must be at least 6 characters"),
  rollNo:        z.string().min(1, "Roll number required").max(20).trim(),
  fatherName:    z.string().min(2, "Father name required").max(100).trim(),
  motherName:    z.string().max(100).trim().optional().or(z.literal("")),
  departmentId:  objectId,
  classId:       objectId.optional().or(z.literal("")),
  admissionYear: z.coerce.number().int().min(2000).max(2030),
  duration:      z.string().optional().or(z.literal("")),
  phone:         z.string().max(15).optional().or(z.literal("")),
  dob:           z.string().max(30).optional().or(z.literal("")),
  bloodGroup:    z.string().max(10).optional().or(z.literal("")),
  address:       z.string().max(250).optional().or(z.literal("")),
  aadharNo:      z.string().max(30).optional().or(z.literal("")),
  status:        z.string().optional(),
});

const editSchema = z.object({
  name:          z.string().min(2, "Name required").max(100).trim(),
  email:         z.string().email("Invalid email").trim(),
  password:      z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  rollNo:        z.string().min(1, "Roll number required").max(20).trim(),
  fatherName:    z.string().min(2, "Father name required").max(100).trim(),
  motherName:    z.string().max(100).trim().optional().or(z.literal("")),
  departmentId:  objectId,
  classId:       objectId.optional().or(z.literal("")),
  admissionYear: z.coerce.number().int().min(2000).max(2030),
  duration:      z.string().optional().or(z.literal("")),
  phone:         z.string().max(15).optional().or(z.literal("")),
  dob:           z.string().max(30).optional().or(z.literal("")),
  bloodGroup:    z.string().max(10).optional().or(z.literal("")),
  address:       z.string().max(250).optional().or(z.literal("")),
  aadharNo:      z.string().max(30).optional().or(z.literal("")),
  isActive:      z.boolean().optional(),
});

// ─── Shared input classes ─────────────────────────────────────────────────────

const inputCls = (err) =>
  `w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500
   focus:outline-none focus:ring-2 transition-colors
   ${err ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:ring-indigo-500"}`;

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {msg}
    </p>
  ) : null;

// ─── Component ────────────────────────────────────────────────────────────────

const StudentFormModal = ({ isOpen, onClose, student, onSuccess, defaultStatus = "active" }) => {
  const isEdit = Boolean(student);
  const schema = isEdit ? editSchema : createSchema;

  const { globalSession } = useSession();

  const [departments, setDepartments]   = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getFormValues = (s) => {
    if (s) {
      return {
        name:          s.user?.name || "",
        email:         s.user?.email || "",
        password:      "",
        rollNo:        s.rollNo || "",
        fatherName:    s.fatherName || "",
        motherName:    s.motherName || "",
        departmentId:  s.department?._id || "",
        classId:       s.class?._id || "",
        admissionYear: s.admissionYear || new Date().getFullYear(),
        duration:      s.duration || "2024-27",
        phone:         s.phone || "",
        dob:           s.dob || "",
        bloodGroup:    s.bloodGroup || "",
        address:       s.address || "",
        aadharNo:      s.aadharNo || "",
        isActive:      s.isActive ?? true,
      };
    }
    return {
      name: "",
      email: "",
      password: "",
      rollNo: "",
      fatherName: "",
      motherName: "",
      departmentId: "",
      classId: "",
      admissionYear: new Date().getFullYear(),
      duration: "2024-27",
      phone: "",
      dob: "",
      bloodGroup: "",
      address: "",
      aadharNo: "",
      status: defaultStatus,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getFormValues(student),
  });

  const selectedDeptId = watch("departmentId");

  // Load departments on open
  useEffect(() => {
    if (!isOpen) return;
    setLoadingDepts(true);
    getDepartments()
      .then(setDepartments)
      .catch(() => toast.error("Could not load departments"))
      .finally(() => setLoadingDepts(false));
  }, [isOpen]);

  // Cascade: load classes when department changes
  useEffect(() => {
    if (!selectedDeptId || !/^[0-9a-fA-F]{24}$/.test(selectedDeptId) || !globalSession) {
      setClasses([]);
      return;
    }
    getClassesByDepartment(selectedDeptId, globalSession._id)
      .then((cls) => {
        setClasses(cls);
        if (!isEdit) setValue("classId", "");
      })
      .catch(() => setClasses([]));
  }, [selectedDeptId, isEdit, setValue, globalSession]);

  // Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (isOpen) {
      reset(getFormValues(student));
    }
  }, [isOpen, student, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (isEdit && (!payload.password || !payload.password.trim())) {
        delete payload.password;
      }
      if (globalSession) {
        payload.academicSessionId = globalSession._id;
      }
      let result;
      if (isEdit) {
        result = await updateStudent(student._id, payload);
        toast.success("Student updated successfully");
      } else {
        result = await createStudent(payload);
        toast.success("Student created successfully");
      }
      onSuccess(result);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Operation failed";
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-slate-900 dark:text-white font-semibold text-lg">
              {isEdit ? "Edit Student Profile & Credentials" : "Add New Student"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? `Updating ${student.user?.name || student.rollNo} • Change any details below` : "Register a new student and create login credentials"}
            </p>
          </div>
          <button
            id="student-modal-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          
          {/* Section 1: Account & Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Account & Login Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="sf-name"
                  type="text"
                  placeholder="Student's full name"
                  {...register("name")}
                  className={inputCls(errors.name)}
                />
                <FieldError msg={errors.name?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="sf-email"
                  type="email"
                  placeholder="student@example.com"
                  {...register("email")}
                  className={inputCls(errors.email)}
                />
                <FieldError msg={errors.email?.message} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEdit ? "Password (Reset / Change)" : "Password"} {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  id="sf-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isEdit ? "Leave blank to keep existing password (or enter 6+ chars to reset)" : "Min. 6 characters"}
                  {...register("password")}
                  className={`${inputCls(errors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isEdit && (
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-500" /> Only type here if you want to reset the student's password.
                </p>
              )}
              <FieldError msg={errors.password?.message} />
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Academic Information
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="sf-rollno"
                  type="text"
                  placeholder="e.g. BCA-I-001"
                  {...register("rollNo")}
                  className={inputCls(errors.rollNo)}
                />
                <FieldError msg={errors.rollNo?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="sf-department"
                  {...register("departmentId")}
                  className={inputCls(errors.departmentId)}
                >
                  <option value="">{loadingDepts ? "Loading…" : "Select department"}</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.departmentId?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class
                </label>
                <select
                  id="sf-class"
                  {...register("classId")}
                  className={inputCls(errors.classId)}
                  disabled={!selectedDeptId || classes.length === 0 || watch("status") === "graduated"}
                >
                  <option value="">
                    {!selectedDeptId
                      ? "Select department first"
                      : classes.length === 0
                      ? "No classes found"
                      : "Select class"}
                  </option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.classId?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="sf-year"
                  type="number"
                  placeholder="2026"
                  {...register("admissionYear")}
                  className={inputCls(errors.admissionYear)}
                />
                <FieldError msg={errors.admissionYear?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Duration
                </label>
                <input
                  id="sf-duration"
                  type="text"
                  placeholder="e.g. 2026-29"
                  {...register("duration")}
                  className={inputCls(errors.duration)}
                />
                <FieldError msg={errors.duration?.message} />
              </div>
            </div>
          </div>

          {/* Section 3: Family & Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Parent & Personal Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="sf-fathername"
                  type="text"
                  placeholder="Father's full name"
                  {...register("fatherName")}
                  className={inputCls(errors.fatherName)}
                />
                <FieldError msg={errors.fatherName?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mother's Name
                </label>
                <input
                  id="sf-mothername"
                  type="text"
                  placeholder="Mother's full name"
                  {...register("motherName")}
                  className={inputCls(errors.motherName)}
                />
                <FieldError msg={errors.motherName?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="sf-phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  {...register("phone")}
                  className={inputCls(errors.phone)}
                />
                <FieldError msg={errors.phone?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  id="sf-dob"
                  type="date"
                  {...register("dob")}
                  className={inputCls(errors.dob)}
                />
                <FieldError msg={errors.dob?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  id="sf-bloodgroup"
                  {...register("bloodGroup")}
                  className={inputCls(errors.bloodGroup)}
                >
                  <option value="">Select (opt)</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <FieldError msg={errors.bloodGroup?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Aadhar Number
                </label>
                <input
                  id="sf-aadharno"
                  type="text"
                  placeholder="12-digit UID"
                  {...register("aadharNo")}
                  className={inputCls(errors.aadharNo)}
                />
                <FieldError msg={errors.aadharNo?.message} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  id="sf-address"
                  type="text"
                  placeholder="Village/City, District, State"
                  {...register("address")}
                  className={inputCls(errors.address)}
                />
                <FieldError msg={errors.address?.message} />
              </div>
            </div>
          </div>

          {/* Section 4: Account Status */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {!isEdit ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select id="sf-status" {...register("status")} className={inputCls(errors.status)}>
                  <option value="active">Active Student</option>
                  <option value="graduated">Alumni / Graduated</option>
                  <option value="dropped">Dropped Out</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <input
                  id="sf-isactive"
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <div>
                  <label htmlFor="sf-isactive" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Active Student Portal Access
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    When checked, student can log in to attendance & academics. Uncheck to temporarily suspend access.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="student-modal-submit"
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold
              rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;
