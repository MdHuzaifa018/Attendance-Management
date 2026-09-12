import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  createClass,
  updateClass,
  getDepartments,
} from "../../services/classService.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a department");

const schema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name is too long")
    .trim(),

  code: z
    .string()
    .min(2, "Class code must be at least 2 characters")
    .max(20, "Class code is too long")
    .trim()
    .toUpperCase(),

  departmentId: objectId,

  semester: z.coerce
    .number()
    .int("Semester must be an integer")
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),

  section: z.string().max(5).trim().toUpperCase().optional().default("A"),

  academicYear: z
    .string()
    .min(4, "Academic year is required (e.g. 2024-25)")
    .max(15)
    .trim(),

  isActive: z.boolean().optional(),
});

const inputCls = (err) =>
  `w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm placeholder-slate-500
   focus:outline-none focus:ring-2 transition-colors
   ${err ? "border-red-500 focus:ring-red-500" : "border-slate-700 hover:border-slate-600 focus:ring-indigo-500"}`;

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {msg}
    </p>
  ) : null;

const ClassFormModal = ({ isOpen, onClose, classData, onSuccess }) => {
  const isEdit = Boolean(classData);
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
          name:         classData.name || "",
          code:         classData.code || "",
          departmentId: classData.department?._id || "",
          semester:     classData.semester || 1,
          section:      classData.section || "A",
          academicYear: classData.academicYear || "2024-25",
          isActive:     classData.isActive ?? true,
        }
      : {
          name: "",
          code: "",
          departmentId: "",
          semester: 1,
          section: "A",
          academicYear: "2024-25",
        },
  });

  useEffect(() => {
    if (!isOpen) return;
    setLoadingDepts(true);
    getDepartments()
      .then(setDepartments)
      .catch(() => toast.error("Could not load departments"))
      .finally(() => setLoadingDepts(false));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              name:         classData.name || "",
              code:         classData.code || "",
              departmentId: classData.department?._id || "",
              semester:     classData.semester || 1,
              section:      classData.section || "A",
              academicYear: classData.academicYear || "2024-25",
              isActive:     classData.isActive ?? true,
            }
          : {
              name: "",
              code: "",
              departmentId: "",
              semester: 1,
              section: "A",
              academicYear: "2024-25",
            }
      );
    }
  }, [isOpen, classData, isEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const updated = await updateClass(classData._id, values);
        toast.success("Class updated successfully");
        onSuccess(updated);
      } else {
        const created = await createClass(values);
        toast.success("Class created successfully");
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (isEdit ? "Failed to update class" : "Failed to create class")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isEdit ? "Edit Class" : "Add New Class"}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {isEdit
                ? `Updating ${classData.name} (${classData.code})`
                : "Creates a class under an academic department"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Class Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. BCA Third Year"
                className={inputCls(errors.name)}
                {...register("name")}
              />
              <FieldError msg={errors.name?.message} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Class Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. BCA-III"
                className={inputCls(errors.code)}
                {...register("code")}
              />
              <FieldError msg={errors.code?.message} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Department <span className="text-red-400">*</span>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Semester <span className="text-red-400">*</span>
              </label>
              <select className={inputCls(errors.semester)} {...register("semester")}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.semester?.message} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Section
              </label>
              <input
                type="text"
                placeholder="A"
                className={inputCls(errors.section)}
                {...register("section")}
              />
              <FieldError msg={errors.section?.message} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Academic Year <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="2024-25"
                className={inputCls(errors.academicYear)}
                {...register("academicYear")}
              />
              <FieldError msg={errors.academicYear?.message} />
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div>
                <p className="text-xs font-medium text-white">Active Status</p>
                <p className="text-xs text-slate-400">
                  Controls visibility in attendance and student assignments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("isActive")}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;
