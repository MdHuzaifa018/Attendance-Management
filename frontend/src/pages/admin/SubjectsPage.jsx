import { useEffect, useState, useCallback } from "react";
import {
  BookMarked,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  GraduationCap,
  Users,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getSubjects,
  deleteSubject,
  getClasses,
  getTeachers,
} from "../../services/subjectService.js";
import SubjectFormModal from "./SubjectFormModal.jsx";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // Lookups for filters
  const [classesList, setClassesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    subject: null,
    deleting: false,
  });

  // Load filter lookups once
  useEffect(() => {
    Promise.all([getClasses(), getTeachers()])
      .then(([cls, tch]) => {
        setClassesList(cls || []);
        setTeachersList(tch || []);
      })
      .catch(() => {
        console.error("Failed to load filter options");
      });
  }, []);

  // Fetch subjects list
  const fetchSubjects = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 20,
          search: search.trim() || undefined,
          classId: selectedClass || undefined,
          teacherId: selectedTeacher || undefined,
        };
        const res = await getSubjects(params);
        setSubjects(res.subjects || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err) {
        toast.error("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    },
    [search, selectedClass, selectedTeacher]
  );

  // Trigger search / filter on change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSubjects]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleOpenDelete = (subject) => {
    setDeleteDialog({ isOpen: true, subject, deleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.subject) return;
    setDeleteDialog((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteSubject(deleteDialog.subject._id);
      toast.success(
        `Subject "${deleteDialog.subject.code}" deleted successfully`
      );
      setDeleteDialog({ isOpen: false, subject: null, deleting: false });
      fetchSubjects(pagination.page);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not delete subject";
      toast.error(msg);
      setDeleteDialog((prev) => ({ ...prev, deleting: false }));
    }
  };

  // Metrics summary
  const totalSubjects = pagination.total || subjects.length;
  const activeSubjects = subjects.filter((s) => s.isActive).length;
  const totalConducted = subjects.reduce(
    (acc, curr) => acc + (curr.totalClasses || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header & Action ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Subject Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Map academic subjects to classes, assign faculty, and configure attendance tracking
          </p>
        </div>

        <button
          id="add-subject-btn"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* ── Metrics Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Subjects
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalSubjects}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookMarked className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Curriculum
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {activeSubjects}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Conducted Classes
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalConducted}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Filters Bar ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Class Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Academic Classes</option>
              {classesList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full sm:w-52 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Faculty Members</option>
              {teachersList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name || t.user?.name}
                </option>
              ))}
            </select>
          </div>

          {(search || selectedClass || selectedTeacher) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedClass("");
                setSelectedTeacher("");
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <BookMarked className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No subjects found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              {search || selectedClass || selectedTeacher
                ? "No subjects matched your selected filters. Try clearing your search parameters."
                : "No academic subjects have been created yet. Click 'Add Subject' to register the first course."}
            </p>
            {search || selectedClass || selectedTeacher ? (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedClass("");
                  setSelectedTeacher("");
                }}
                className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={handleOpenCreate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                Add First Subject
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Code & Subject Title</th>
                  <th className="px-6 py-3.5">Academic Class</th>
                  <th className="px-6 py-3.5">Assigned Faculty</th>
                  <th className="px-6 py-3.5 text-center">Conducted Classes</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-white">
                {subjects.map((sub) => {
                  const facultyName =
                    sub.teacher?.user?.name ||
                    sub.teacher?.name ||
                    "Unassigned";
                  const facultyInitial = facultyName[0]?.toUpperCase() || "T";
                  const facultyId = sub.teacher?.employeeId || "—";

                  return (
                    <tr
                      key={sub._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Code & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-lg">
                            {sub.code}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-snug">
                              {sub.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            {sub.class?.code || "—"}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                            {sub.class?.name}
                          </span>
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0">
                            {facultyInitial}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-xs leading-tight">
                              {facultyName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {sub.teacher?.designation || facultyId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Conducted Classes */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {sub.totalClasses || 0} classes
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        {sub.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Edit Subject"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(sub)}
                            className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            <span>
              Showing {subjects.length} of {pagination.total} subjects
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchSubjects(pagination.page - 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchSubjects(pagination.page + 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Subject Form Modal ─────────────────────────────────────────── */}
      <SubjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subjectData={editingSubject}
        onSuccess={() => fetchSubjects(pagination.page)}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() =>
              !deleteDialog.deleting &&
              setDeleteDialog({ isOpen: false, subject: null, deleting: false })
            }
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Subject?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  "{deleteDialog.subject?.name}" (
                  {deleteDialog.subject?.code})
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleteDialog.deleting}
                onClick={() =>
                  setDeleteDialog({
                    isOpen: false,
                    subject: null,
                    deleting: false,
                  })
                }
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteDialog.deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl shadow-sm shadow-red-600/30 flex items-center gap-2 transition-colors cursor-pointer"
              >
                {deleteDialog.deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Subject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
