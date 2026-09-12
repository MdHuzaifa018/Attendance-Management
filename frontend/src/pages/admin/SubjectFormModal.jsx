import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, AlertCircle, Loader2, BookMarked } from "lucide-react";
import toast from "react-hot-toast";
import {
  createSubject,
  updateSubject,
  getClasses,
  getTeachers,
} from "../../services/subjectService.js";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Please select a valid option from the list");

const schema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name is too long")
    .trim(),

  code: z
    .string()
    .min(2, "Subject code must be at least 2 characters")
    .max(20, "Subject code is too long")
    .trim()
    .toUpperCase(),

  classId: objectId,

  teacherId: objectId,

  totalClasses: z.coerce
    .number()
    .int("Total classes must be an integer")
    .min(0, "Total classes cannot be negative")
    .optional()
    .default(0),

  isActive: z.boolean().optional(),
});

const inputCls = (err) =>
  `w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500
   focus:outline-hidden focus:ring-2 transition-colors
   ${
     err
       ? "border-red-500 focus:ring-red-500"
       : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:ring-indigo-500"
   }`;

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {msg}
    </p>
  ) : null;

const SubjectFormModal = ({ isOpen, onClose, subjectData, onSuccess }) => {
  const isEdit = Boolean(subjectData);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      classId: "",
      teacherId: "",
      totalClasses: 0,
      isActive: true,
    },
  });

  // Load dropdown lists when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoadingLookups(true);
    Promise.all([getClasses(), getTeachers()])
      .then(([clsList, tchList]) => {
        setClasses(clsList || []);
        setTeachers(tchList || []);
      })
      .catch(() => {
        toast.error("Failed to load classes or teachers for dropdowns");
      })
      .finally(() => setLoadingLookups(false));
  }, [isOpen]);

  // Sync form default values on edit/create
  useEffect(() => {
    if (!isOpen) return;

    if (subjectData) {
      reset({
        name: subjectData.name || "",
        code: subjectData.code || "",
        classId: subjectData.class?._id || "",
        teacherId: subjectData.teacher?._id || "",
        totalClasses: subjectData.totalClasses || 0,
        isActive: subjectData.isActive ?? true,
      });
    } else {
      reset({
        name: "",
        code: "",
        classId: "",
        teacherId: "",
        totalClasses: 0,
        isActive: true,
      });
    }
  }, [isOpen, subjectData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateSubject(subjectData._id, values);
        toast.success(`Subject "${values.code}" updated successfully`);
      } else {
        await createSubject(values);
        toast.success(`Subject "${values.code}" created successfully`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to save subject";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isEdit ? "Edit Subject" : "Create New Subject"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit
                  ? "Update subject details, class mapping, or assigned faculty"
                  : "Associate a new subject with an academic class & teacher"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {loadingLookups && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              Loading classes and faculty members...
            </div>
          )}

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Database Management Systems (DBMS)"
              className={inputCls(errors.name)}
            />
            <FieldError msg={errors.name?.message} />
          </div>

          {/* Subject Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Subject Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register("code")}
              type="text"
              placeholder="e.g. BCA-302"
              className={inputCls(errors.code)}
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Must be unique within the selected class. Will automatically be uppercase.
            </p>
            <FieldError msg={errors.code?.message} />
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Academic Class <span className="text-red-500">*</span>
            </label>
            <select
              {...register("classId")}
              className={inputCls(errors.classId)}
              disabled={loadingLookups}
            >
              <option value="">Select an academic class...</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.code} — {cls.name} (Sem {cls.semester})
                </option>
              ))}
            </select>
            <FieldError msg={errors.classId?.message} />
          </div>

          {/* Assigned Faculty Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Assigned Faculty Member <span className="text-red-500">*</span>
            </label>
            <select
              {...register("teacherId")}
              className={inputCls(errors.teacherId)}
              disabled={loadingLookups}
            >
              <option value="">Select assigned teacher...</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name || t.user?.name} ({t.employeeId}) — {t.designation}
                </option>
              ))}
            </select>
            <FieldError msg={errors.teacherId?.message} />
          </div>

          {/* Total Classes Conducted */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Conducted Classes Count (Initial / Historical)
            </label>
            <input
              {...register("totalClasses")}
              type="number"
              min="0"
              className={inputCls(errors.totalClasses)}
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Increments automatically as attendance is recorded by faculty.
            </p>
            <FieldError msg={errors.totalClasses?.message} />
          </div>

          {/* Active Status (Edit only) */}
          {isEdit && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subject is actively taught this semester
                </span>
              </label>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingLookups}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-indigo-600/30 flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Subject"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectFormModal;
