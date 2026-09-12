import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  createStudent,
  updateStudent,
  getDepartments,
  getClassesByDepartment,
} from "../../services/studentService.js";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select an option");

const createSchema = z.object({
  name:          z.string().min(2, "Name required").max(100).trim(),
  email:         z.string().email("Invalid email").trim(),
  password:      z.string().min(6, "Password must be at least 6 characters"),
  rollNo:        z.string().min(1, "Roll number required").max(20).trim(),
  fatherName:    z.string().min(2, "Father name required").max(100).trim(),
  departmentId:  objectId,
  classId:       objectId,
  admissionYear: z.coerce.number().int().min(2000).max(2030),
  phone:         z.string().max(15).optional().or(z.literal("")),
});

const editSchema = z.object({
  rollNo:        z.string().min(1, "Roll number required").max(20).trim(),
  fatherName:    z.string().min(2, "Father name required").max(100).trim(),
  departmentId:  objectId,
  classId:       objectId,
  admissionYear: z.coerce.number().int().min(2000).max(2030),
  phone:         z.string().max(15).optional().or(z.literal("")),
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

/**
 * StudentFormModal
 *
 * Props:
 *   isOpen       boolean
 *   onClose      () => void
 *   student      null | student object (null = create mode, object = edit mode)
 *   onSuccess    (newOrUpdatedStudent) => void
 */
const StudentFormModal = ({ isOpen, onClose, student, onSuccess }) => {
  const isEdit = Boolean(student);
  const schema = isEdit ? editSchema : createSchema;

  const [departments, setDepartments]   = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          rollNo:        student.rollNo || "",
          fatherName:    student.fatherName || "",
          departmentId:  student.department?._id || "",
          classId:       student.class?._id || "",
          admissionYear: student.admissionYear || new Date().getFullYear(),
          phone:         student.phone || "",
          isActive:      student.isActive ?? true,
        }
      : {
          name: "", email: "", password: "",
          rollNo: "", fatherName: "",
          departmentId: "", classId: "",
          admissionYear: new Date().getFullYear(),
          phone: "",
        },
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
    if (!selectedDeptId || !/^[0-9a-fA-F]{24}$/.test(selectedDeptId)) {
      setClasses([]);
      return;
    }
    getClassesByDepartment(selectedDeptId)
      .then((cls) => {
        setClasses(cls);
        // If edit mode and the class belongs to this dept, keep it; otherwise reset
        if (!isEdit) setValue("classId", "");
      })
      .catch(() => setClasses([]));
  }, [selectedDeptId, isEdit, setValue]);

  // Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              rollNo:        student.rollNo || "",
              fatherName:    student.fatherName || "",
              departmentId:  student.department?._id || "",
              classId:       student.class?._id || "",
              admissionYear: student.admissionYear || new Date().getFullYear(),
              phone:         student.phone || "",
              isActive:      student.isActive ?? true,
            }
          : {
              name: "", email: "", password: "",
              rollNo: "", fatherName: "",
              departmentId: "", classId: "",
              admissionYear: new Date().getFullYear(),
              phone: "",
            }
      );
    }
  }, [isOpen, student, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      let result;
      if (isEdit) {
        result = await updateStudent(student._id, data);
        toast.success("Student updated successfully");
      } else {
        result = await createStudent(data);
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
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <h2 className="text-slate-900 dark:text-white font-semibold text-base">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            id="student-modal-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="overflow-y-auto flex-1 px-6 py-5">
          <div className="space-y-4">

            {/* User account section (create only) */}
            {!isEdit && (
              <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">
                  Account Details
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input id="sf-name" type="text" placeholder="Student's full name"
                    {...register("name")} className={inputCls(errors.name)} />
                  <FieldError msg={errors.name?.message} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <input id="sf-email" type="email" placeholder="student@example.com"
                      {...register("email")} className={inputCls(errors.email)} />
                    <FieldError msg={errors.email?.message} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <input id="sf-password" type="password" placeholder="Min. 6 characters"
                      {...register("password")} className={inputCls(errors.password)} />
                    <FieldError msg={errors.password?.message} />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                    Student Profile
                  </p>
                </div>
              </div>
            )}

            {/* Roll No + Father Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Roll Number</label>
                <input id="sf-rollno" type="text" placeholder="e.g. BCA-III-006"
                  {...register("rollNo")} className={inputCls(errors.rollNo)} />
                <FieldError msg={errors.rollNo?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Father's Name</label>
                <input id="sf-fathername" type="text" placeholder="Father's full name"
                  {...register("fatherName")} className={inputCls(errors.fatherName)} />
                <FieldError msg={errors.fatherName?.message} />
              </div>
            </div>

            {/* Department + Class cascade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <select id="sf-department" {...register("departmentId")} className={inputCls(errors.departmentId)}>
                  <option value="">{loadingDepts ? "Loading…" : "Select department"}</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.code} — {d.name}</option>
                  ))}
                </select>
                <FieldError msg={errors.departmentId?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Class</label>
                <select id="sf-class" {...register("classId")} className={inputCls(errors.classId)}
                  disabled={!selectedDeptId || classes.length === 0}>
                  <option value="">
                    {!selectedDeptId ? "Select department first" : classes.length === 0 ? "No classes found" : "Select class"}
                  </option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
                  ))}
                </select>
                <FieldError msg={errors.classId?.message} />
              </div>
            </div>

            {/* Admission Year + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Admission Year</label>
                <input id="sf-year" type="number" min="2000" max="2030" placeholder="2022"
                  {...register("admissionYear")} className={inputCls(errors.admissionYear)} />
                <FieldError msg={errors.admissionYear?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone <span className="text-slate-400 dark:text-slate-500">(optional)</span></label>
                <input id="sf-phone" type="tel" placeholder="10-digit number"
                  {...register("phone")} className={inputCls(errors.phone)} />
                <FieldError msg={errors.phone?.message} />
              </div>
            </div>

            {/* isActive toggle — edit only */}
            {isEdit && (
              <div className="flex items-center gap-3 pt-1">
                <input id="sf-isactive" type="checkbox" {...register("isActive")}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                <label htmlFor="sf-isactive" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  Active (uncheck to deactivate this student)
                </label>
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-transparent flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            id="student-modal-submit"
            type="submit"
            form=""
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold
              rounded-lg transition-colors shadow-sm"
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
