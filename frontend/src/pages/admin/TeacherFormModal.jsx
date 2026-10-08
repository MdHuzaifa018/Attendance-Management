import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2, KeyRound, User, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import {
  createTeacher,
  updateTeacher,
  getDepartments,
} from "../../services/teacherService.js";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const createSchema = z.object({
  name:          z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email:         z.string().email("Invalid email address").trim(),
  password:      z.string().min(6, "Password must be at least 6 characters"),
  employeeId:    z.string().min(1, "Employee ID is required").max(20).trim(),
  departmentIds: z.array(objectId).min(1, "Please select at least one department"),
  phone:         z.string().max(15).optional().or(z.literal("")),
  designation:   z.string().min(1, "Designation is required").max(50).trim(),
});

const editSchema = z.object({
  name:          z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email:         z.string().email("Invalid email address").trim(),
  password:      z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  employeeId:    z.string().min(1, "Employee ID is required").max(20).trim(),
  departmentIds: z.array(objectId).min(1, "Please select at least one department"),
  phone:         z.string().max(15).optional().or(z.literal("")),
  designation:   z.string().min(1, "Designation is required").max(50).trim(),
  isActive:      z.boolean().optional(),
});

// ─── Shared UI Helpers ───────────────────────────────────────────────────────

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

const DESIGNATIONS = [
  "Assistant Professor",
  "Associate Professor",
  "Associate Professor & HOD",
  "Professor",
  "Visiting Faculty",
  "Lecturer",
];

// ─── Component ────────────────────────────────────────────────────────────────

const TeacherFormModal = ({ isOpen, onClose, teacher, onSuccess }) => {
  const isEdit = Boolean(teacher);
  const schema = isEdit ? editSchema : createSchema;

  const [departments, setDepartments]   = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const getTeacherDefaults = (t) => {
    if (t) {
      return {
        name:          t.user?.name || "",
        email:         t.user?.email || "",
        password:      "",
        employeeId:    t.employeeId || "",
        departmentIds: t.departments?.map((d) => (typeof d === "object" ? d._id : d)) || [],
        phone:         t.phone || "",
        designation:   t.designation || "Assistant Professor",
        isActive:      t.isActive ?? true,
      };
    }
    return {
      name: "",
      email: "",
      password: "",
      employeeId: "",
      departmentIds: [],
      phone: "",
      designation: "Assistant Professor",
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getTeacherDefaults(teacher),
  });

  // Load departments whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoadingDepts(true);
    getDepartments()
      .then(setDepartments)
      .catch(() => toast.error("Could not load departments"))
      .finally(() => setLoadingDepts(false));
  }, [isOpen]);

  // Reset form values when teacher prop or isOpen changes
  useEffect(() => {
    if (isOpen) {
      reset(getTeacherDefaults(teacher));
    }
  }, [isOpen, teacher, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (isEdit && (!payload.password || !payload.password.trim())) {
        delete payload.password;
      }
      if (isEdit) {
        const updated = await updateTeacher(teacher._id, payload);
        toast.success("Teacher updated successfully");
        onSuccess(updated);
      } else {
        const created = await createTeacher(payload);
        toast.success("Teacher created successfully");
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (isEdit ? "Failed to update teacher" : "Failed to create teacher");
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEdit ? "Edit Teacher Profile & Credentials" : "Add New Teacher"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              {isEdit
                ? `Updating ${teacher.user?.name || teacher.employeeId} • Modify name, credentials, or faculty details`
                : "Creates a teacher profile and portal login credentials"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Account Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Account & Portal Access
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Sharma"
                className={inputCls(errors.name)}
                {...register("name")}
              />
              <FieldError msg={errors.name?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="teacher@nalanda.edu"
                  className={inputCls(errors.email)}
                  {...register("email")}
                />
                <FieldError msg={errors.email?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEdit ? "Password (Reset / Change)" : "Password"} {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  placeholder={isEdit ? "Leave blank to keep current password" : "At least 6 characters"}
                  className={inputCls(errors.password)}
                  {...register("password")}
                />
                {isEdit && (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-500" /> Only enter if resetting password.
                  </p>
                )}
                <FieldError msg={errors.password?.message} />
              </div>
            </div>
          </div>

          {/* Teacher Profile fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Faculty Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TCH-001"
                  className={inputCls(errors.employeeId)}
                  {...register("employeeId")}
                />
                <FieldError msg={errors.employeeId?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputCls(errors.designation)}
                  {...register("designation")}
                >
                  {DESIGNATIONS.map((des) => (
                    <option key={des} value={des}>
                      {des}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.designation?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  className={inputCls(errors.phone)}
                  {...register("phone")}
                />
                <FieldError msg={errors.phone?.message} />
              </div>

              <div className="flex items-center">
                {isEdit && (
                  <div className="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl mt-4 sm:mt-0">
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">Active Status</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Portal access enabled</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register("isActive")}
                      />
                      <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Departments (Select one or more) <span className="text-red-500">*</span>
              </label>
              
              {loadingDepts ? (
                <div className="text-xs text-slate-500 py-2 animate-pulse">Loading departments...</div>
              ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-xl bg-slate-50 dark:bg-slate-800/50 ${errors.departmentIds ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}>
                  {departments.map((d) => (
                    <label key={d._id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors">
                      <input
                        type="checkbox"
                        value={d._id}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-offset-slate-900"
                        {...register("departmentIds")}
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{d.name} ({d.code})</span>
                    </label>
                  ))}
                </div>
              )}
              <FieldError msg={errors.departmentIds?.message} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherFormModal;
