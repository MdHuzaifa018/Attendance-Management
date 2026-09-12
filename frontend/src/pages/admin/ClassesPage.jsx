import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getClasses,
  deleteClass,
  getDepartments,
} from "../../services/classService.js";
import ClassFormModal from "./ClassFormModal.jsx";

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

const EmptyState = ({ hasSearch, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4">
      <BookOpen className="w-7 h-7 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
      {hasSearch ? "No classes found" : "No classes yet"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
      {hasSearch
        ? "Try a different search term or clear the department filter."
        : "Add your first class to organize students and attendance."}
    </p>
    {!hasSearch && (
      <button
        id="empty-add-class-btn"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Class
      </button>
    )}
  </div>
);

const DeleteConfirm = ({ classData, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6">
      <div className="w-10 h-10 bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Delete class?</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
        This will permanently remove{" "}
        <span className="text-slate-900 dark:text-white font-semibold">{classData?.name}</span> (
        {classData?.code}). Ensure no students or subjects are attached.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          id="confirm-delete-class-btn"
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

const ClassesPage = () => {
  const [classes, setClasses]                 = useState([]);
  const [departments, setDepartments]         = useState([]);
  const [selectedDept, setSelectedDept]       = useState("");
  const [pagination, setPagination]           = useState({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage]         = useState(1);

  const [modalOpen, setModalOpen]             = useState(false);
  const [editingClass, setEditingClass]       = useState(null);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleting, setDeleting]               = useState(false);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getClasses({
        search: debouncedSearch,
        departmentId: selectedDept,
        page: currentPage,
        limit: 20,
      });
      setClasses(result.classes || []);
      setPagination(result.pagination || { total: 0, page: 1, totalPages: 1, limit: 20 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedDept, currentPage]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cls) => {
    setEditingClass(cls);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClass(deleteTarget._id);
      toast.success("Class deleted");
      setDeleteTarget(null);
      loadClasses();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Classes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {pagination.total} class{pagination.total !== 1 ? "es" : ""} total
          </p>
        </div>
        <button
          id="add-class-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            id="class-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by class name or code…"
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="sm:w-64">
          <select
            id="class-dept-filter"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none transition-colors shadow-sm"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : classes.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(debouncedSearch || selectedDept)}
            onAdd={handleOpenAdd}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Class Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Semester</th>
                    <th className="px-6 py-4">Section</th>
                    <th className="px-6 py-4">Academic Year</th>
                    <th className="px-6 py-4 text-center">Students</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classes.map((cls) => (
                    <tr
                      key={cls._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {cls.code}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {cls.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-xs">
                        {cls.department?.code ? (
                          <span>{cls.department.name} ({cls.department.code})</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-xs">
                        Sem {cls.semester}
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                        {cls.section}
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-xs">
                        {cls.academicYear}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                          {cls.stats?.students ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge isActive={cls.isActive} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`edit-class-${cls._id}`}
                            onClick={() => handleOpenEdit(cls)}
                            title="Edit class"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-class-${cls._id}`}
                            onClick={() => setDeleteTarget(cls)}
                            title="Delete class"
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
                <span className="text-slate-900 dark:text-white font-semibold">{pagination.total}</span> classes
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="class-prev-page"
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
                  id="class-next-page"
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

      <ClassFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        classData={editingClass}
        onSuccess={loadClasses}
      />

      {deleteTarget && (
        <DeleteConfirm
          classData={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default ClassesPage;
