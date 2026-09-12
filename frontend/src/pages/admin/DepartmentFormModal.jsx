import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  createDepartment,
  updateDepartment,
} from "../../services/departmentService.js";

const schema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name is too long")
    .trim(),

  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code cannot exceed 10 characters")
    .trim()
    .toUpperCase(),

  description: z.string().max(500, "Description is too long").trim().optional(),
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

const DepartmentFormModal = ({ isOpen, onClose, department, onSuccess }) => {
  const isEdit = Boolean(department);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          name: department.name || "",
          code: department.code || "",
          description: department.description || "",
          isActive: department.isActive ?? true,
        }
      : {
          name: "",
          code: "",
          description: "",
        },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              name: department.name || "",
              code: department.code || "",
              description: department.description || "",
              isActive: department.isActive ?? true,
            }
          : {
              name: "",
              code: "",
              description: "",
            }
      );
    }
  }, [isOpen, department, isEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const updated = await updateDepartment(department._id, values);
        toast.success("Department updated successfully");
        onSuccess(updated);
      } else {
        const created = await createDepartment(values);
        toast.success("Department created successfully");
        onSuccess(created);
      }
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (isEdit ? "Failed to update department" : "Failed to create department")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isEdit ? "Edit Department" : "Add Department"}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {isEdit
                ? `Updating ${department.name} (${department.code})`
                : "Creates an academic department"}
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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Department Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bachelor of Computer Applications"
              className={inputCls(errors.name)}
              {...register("name")}
            />
            <FieldError msg={errors.name?.message} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Department Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. BCA"
              className={inputCls(errors.code)}
              {...register("code")}
            />
            <FieldError msg={errors.code?.message} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the department…"
              className={inputCls(errors.description)}
              {...register("description")}
            />
            <FieldError msg={errors.description?.message} />
          </div>

          {isEdit && (
            <div className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div>
                <p className="text-xs font-medium text-white">Active Status</p>
                <p className="text-xs text-slate-400">
                  Controls visibility in class and student selectors
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
              {isEdit ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormModal;
