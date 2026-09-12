import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  createTeacher,
  updateTeacher,
  getDepartments,
} from "../../services/teacherService.js";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a department");

const createSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email:        z.string().email("Invalid email address").trim(),
  password:     z.string().min(6, "Password must be at least 6 characters"),
  employeeId:   z.string().min(1, "Employee ID is required").max(20).trim(),
  departmentId: objectId,
  phone:        z.string().max(15).optional().or(z.literal("")),
  designation:  z.string().min(1, "Designation is required").max(50).trim(),
});

const editSchema = z.object({
  employeeId:   z.string().min(1, "Employee ID is required").max(20).trim(),
  departmentId: objectId,
  phone:        z.string().max(15).optional().or(z.literal("")),
  designation:  z.string().min(1, "Designation is required").max(50).trim(),
  isActive:     z.boolean().optional(),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          employeeId:   teacher.employeeId || "",
          departmentId: teacher.department?._id || "",
          phone:        teacher.phone || "",
          designation:  teacher.designation || "Assistant Professor",
          isActive:     teacher.isActive ?? true,
        }
      : {
          name: "",
          email: "",
          password: "",
          employeeId: "",
          departmentId: "",
          phone: "",
          designation: "Assistant Professor",
        },
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
      reset(
        isEdit
          ? {
              employeeId:   teacher.employeeId || "",
              departmentId: teacher.department?._id || "",
              phone:        teacher.phone || "",
              designation:  teacher.designation || "Assistant Professor",
              isActive:     teacher.isActive ?? true,
            }
          : {
              name: "",
              email: "",
              password: "",
              employeeId: "",
              departmentId: "",
              phone: "",
              designation: "Assistant Professor",
            }
      );
    }
  }, [isOpen, teacher, isEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const updated = await updateTeacher(teacher._id, values);
        toast.success("Teacher updated successfully");
        onSuccess(updated);
      } else {
        const created = await createTeacher(values);
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
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEdit ? "Edit Teacher" : "Add New Teacher"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              {isEdit
                ? `Updating ${teacher.user?.name} (${teacher.employeeId})`
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Create-only account fields */}
          {!isEdit && (
            <div className="space-y-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Account Credentials
              </p>

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
                    placeholder="rajesh@nalanda.edu"
                    className={inputCls(errors.email)}
                    {...register("email")}
                  />
                  <FieldError msg={errors.email?.message} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    className={inputCls(errors.password)}
                    {...register("password")}
                  />
                  <FieldError msg={errors.password?.message} />
                </div>
              </div>
            </div>
          )}

          {/* Teacher Profile fields */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Profile Details
            </p>

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
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={loadingDepts}
                  className={inputCls(errors.departmentId)}
                  {...register("departmentId")}
                >
                  <option value="">
                    {loadingDepts ? "Loading departments…" : "Select Department"}
                  </option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.departmentId?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            {/* Status toggle in edit mode */}
            {isEdit && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl">
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Active Status</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Disabling restricts portal access for this teacher
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register("isActive")}
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
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
