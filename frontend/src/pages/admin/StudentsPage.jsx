import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Users, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { getStudents, deleteStudent } from "../../services/studentService.js";
import StudentFormModal from "./StudentFormModal.jsx";

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ isActive }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
      Inactive
    </span>
  );

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ hasSearch, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
      <Users className="w-7 h-7 text-slate-500" />
    </div>
    <h3 className="text-white font-semibold mb-1">
      {hasSearch ? "No students found" : "No students yet"}
    </h3>
    <p className="text-slate-400 text-sm mb-4">
      {hasSearch
        ? "Try a different search term or clear the filter."
        : "Add your first student to get started."}
    </p>
    {!hasSearch && (
      <button
        id="empty-add-student-btn"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
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
    <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
      <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <h3 className="text-white font-semibold mb-1">Delete student?</h3>
      <p className="text-slate-400 text-sm mb-5">
        This will permanently delete{" "}
        <span className="text-white font-medium">{student?.user?.name}</span>{" "}
        ({student?.rollNo}) and their login account. This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
          Cancel
        </button>
        <button
          id="confirm-delete-btn"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500
            disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
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
  const [currentPage, setCurrentPage]       = useState(1);

  // Modal state
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = create

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
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

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
          <h2 className="text-xl font-bold text-white">Students</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {pagination.total} student{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          id="add-student-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="student-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or roll number…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-white text-sm
            placeholder-slate-500 focus:outline-none transition-colors"
        />
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <EmptyState hasSearch={!!debouncedSearch} onAdd={handleOpenAdd} />
        ) : (
          <>
            {/* Table — scrollable horizontally on small screens */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-5 py-3">Roll No</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Name</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Department</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Class</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Phone</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Year</th>
                    <th className="text-left text-slate-500 font-semibold text-xs uppercase tracking-widest px-4 py-3">Status</th>
                    <th className="text-right text-slate-500 font-semibold text-xs uppercase tracking-widest px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-indigo-300 text-xs font-medium">{s.rollNo}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-white font-medium">{s.user?.name}</p>
                          <p className="text-slate-500 text-xs">{s.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">{s.department?.code || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-300">{s.class?.code || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-400">{s.phone || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-400">{s.admissionYear}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge isActive={s.isActive} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-student-${s._id}`}
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-student-${s._id}`}
                            onClick={() => handleDeleteClick(s)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800">
              <p className="text-slate-400 text-xs">
                Showing <span className="text-white">{showingFrom}–{showingTo}</span>{" "}
                of <span className="text-white">{pagination.total}</span> students
              </p>
              <div className="flex items-center gap-2">
                <button
                  id="prev-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
                    hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-slate-400 text-xs px-1">
                  Page <span className="text-white">{currentPage}</span> of{" "}
                  <span className="text-white">{pagination.totalPages}</span>
                </span>
                <button
                  id="next-page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
                    hover:bg-slate-800 rounded-lg transition-colors"
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
    </div>
  );
};

export default StudentsPage;
