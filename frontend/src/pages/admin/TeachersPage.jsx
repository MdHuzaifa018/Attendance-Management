import { useState, useEffect, useCallback } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getTeachers, deleteTeacher } from "../../services/teacherService.js";
import TeacherFormModal from "./TeacherFormModal.jsx";

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ isActive }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded-full">
      Inactive
    </span>
  );

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ hasSearch, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4">
      <UserCheck className="w-7 h-7 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
      {hasSearch ? "No teachers found" : "No teachers yet"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
      {hasSearch
        ? "Try a different search term or clear the filter."
        : "Add your first faculty member to get started."}
    </p>
    {!hasSearch && (
      <button
        id="empty-add-teacher-btn"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      >
        <UserPlus className="w-4 h-4" />
        Add Teacher
      </button>
    )}
  </div>
);

// ─── Delete confirmation dialog ───────────────────────────────────────────────

const DeleteConfirm = ({ teacher, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6">
      <div className="w-10 h-10 bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Delete teacher?</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
        This will permanently delete{" "}
        <span className="text-slate-900 dark:text-white font-semibold">{teacher?.user?.name}</span>{" "}
        ({teacher?.employeeId}) and their portal login account. This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          id="confirm-delete-teacher-btn"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Teachers Page ───────────────────────────────────────────────────────

const TeachersPage = () => {
  const [teachers, setTeachers]               = useState([]);
  const [pagination, setPagination]           = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage]         = useState(1);

  // Modal states
  const [modalOpen, setModalOpen]             = useState(false);
  const [editingTeacher, setEditingTeacher]   = useState(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleting, setDeleting]               = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load teachers from backend
  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTeachers({
        search: debouncedSearch,
        page: currentPage,
        limit: 20,
      });
      setTeachers(result.teachers || []);
      setPagination(result.pagination || { total: 0, page: 1, totalPages: 1, limit: 20 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Modal handlers
  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadTeachers();
  };

  const handleDeleteClick = (teacher) => setDeleteTarget(teacher);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTeacher(deleteTarget._id);
      toast.success("Teacher deleted");
      setDeleteTarget(null);
      loadTeachers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const showingFrom = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const showingTo   = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Teachers</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {pagination.total} faculty member{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          id="add-teacher-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          id="teacher-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or employee ID…"
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : teachers.length === 0 ? (
          <EmptyState hasSearch={Boolean(debouncedSearch)} onAdd={handleOpenAdd} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Employee ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Designation</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Employee ID */}
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {teacher.employeeId}
                      </td>

                      {/* Name + Email */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {teacher.user?.name || "—"}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                          {teacher.user?.email || "—"}
                        </p>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {teacher.department?.name ? (
                          <span>{teacher.department.name} ({teacher.department.code})</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>

                      {/* Designation */}
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {teacher.designation || "Assistant Professor"}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {teacher.phone || <span className="text-slate-400 dark:text-slate-500">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge isActive={teacher.isActive} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`edit-teacher-${teacher._id}`}
                            onClick={() => handleOpenEdit(teacher)}
                            title="Edit teacher"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-teacher-${teacher._id}`}
                            onClick={() => handleDeleteClick(teacher)}
                            title="Delete teacher"
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-transparent text-xs text-slate-500 dark:text-slate-400">
              <span>
                Showing <span className="text-slate-900 dark:text-white font-semibold">{showingFrom}</span>–
                <span className="text-slate-900 dark:text-white font-semibold">{showingTo}</span> of{" "}
                <span className="text-slate-900 dark:text-white font-semibold">{pagination.total}</span> teachers
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="teacher-prev-page"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page <span className="text-slate-900 dark:text-white font-semibold">{currentPage}</span> of{" "}
                  <span className="text-slate-900 dark:text-white font-semibold">{pagination.totalPages}</span>
                </span>
                <button
                  id="teacher-next-page"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage >= pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Teacher Form Modal (Add / Edit) */}
      <TeacherFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        teacher={editingTeacher}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirm
          teacher={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default TeachersPage;
