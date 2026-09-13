import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Users, AlertTriangle, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { getStudents, deleteStudent } from "../../services/studentService.js";
import { getClasses } from "../../services/classService.js";
import StudentFormModal from "./StudentFormModal.jsx";
import StudentIdCardModal from "../../components/StudentIdCardModal.jsx";

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
      <Users className="w-7 h-7 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
      {hasSearch ? "No students found" : "No students yet"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
      {hasSearch
        ? "Try a different search term or clear the filter."
        : "Add your first student to get started."}
    </p>
    {!hasSearch && (
      <button
        id="empty-add-student-btn"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      >
        <UserPlus className="w-4 h-4" />
        Add Student
      </button>
    )}
  </div>
);

// ─── Delete confirmation dialog ───────────────────────────────────────────────

const DeleteConfirm = ({ student, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6">
      <div className="w-10 h-10 bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Delete student?</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
        This will permanently delete{" "}
        <span className="text-slate-900 dark:text-white font-semibold">{student?.user?.name}</span>{" "}
        ({student?.rollNo}) and their login account. This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
          Cancel
        </button>
        <button
          id="confirm-delete-btn"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500
            disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const StudentsPage = () => {
  const [students, setStudents]             = useState([]);
  const [pagination, setPagination]         = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classFilter, setClassFilter]       = useState("");
  const [classes, setClasses]               = useState([]);
  const [currentPage, setCurrentPage]       = useState(1);

  // Modal state
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = create
  const [idCardStudent, setIdCardStudent]   = useState(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [deleting, setDeleting]             = useState(false);

  // Debounce search — resets to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load students whenever search or page changes
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getStudents({
        search: debouncedSearch,
        classId: classFilter,
        page: currentPage,
        limit: 20,
      });
      setStudents(result.students);
      setPagination(result.pagination);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, classFilter, currentPage]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    getClasses({ all: true })
      .then((res) => setClasses(res.classes || []))
      .catch(() => {});
  }, []);

  // Handlers
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadStudents();
  };

  const handleDeleteClick = (student) => setDeleteTarget(student);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteStudent(deleteTarget._id);
      toast.success("Student deleted");
      setDeleteTarget(null);
      loadStudents();
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
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Students</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {pagination.total} student{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          id="add-student-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* ── Filters bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            id="student-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll number…"
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-900 dark:text-white text-sm
              placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors shadow-sm"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => {
            setClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition-colors shadow-sm cursor-pointer"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.code})
            </option>
          ))}
        </select>
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <EmptyState hasSearch={!!debouncedSearch} onAdd={handleOpenAdd} />
        ) : (
          <>
            {/* Table — scrollable horizontally on small screens */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50">
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-5 py-3.5">Roll No</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Name</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Department</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Class</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Phone</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Batch</th>
                    <th className="text-left text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-4 py-3.5">Status</th>
                    <th className="text-right text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 text-xs font-semibold">{s.rollNo}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">{s.user?.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">{s.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{s.department?.code || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{s.class?.code || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{s.phone || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{s.duration ? s.duration : s.admissionYear}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge isActive={s.isActive} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`idcard-student-${s._id}`}
                            onClick={() => setIdCardStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Generate Official ID Card"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`edit-student-${s._id}`}
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit student"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-student-${s._id}`}
                            onClick={() => handleDeleteClick(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-transparent">
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Showing <span className="text-slate-900 dark:text-white font-semibold">{showingFrom}–{showingTo}</span>{" "}
                of <span className="text-slate-900 dark:text-white font-semibold">{pagination.total}</span> students
              </p>
              <div className="flex items-center gap-2">
                <button
                  id="prev-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                    hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-slate-500 dark:text-slate-400 text-xs px-1">
                  Page <span className="text-slate-900 dark:text-white font-semibold">{currentPage}</span> of{" "}
                  <span className="text-slate-900 dark:text-white font-semibold">{pagination.totalPages}</span>
                </span>
                <button
                  id="next-page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                    hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Add/Edit modal ───────────────────────────────────────────── */}
      <StudentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={editingStudent}
        onSuccess={handleModalSuccess}
      />

      {/* ── Delete confirm dialog ────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteConfirm
          student={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* ── Official Student ID Card Modal ────────────────────────────── */}
      <StudentIdCardModal
        isOpen={!!idCardStudent}
        onClose={() => setIdCardStudent(null)}
        student={idCardStudent}
      />
    </div>
  );
};

export default StudentsPage;
