import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getDepartments,
  deleteDepartment,
} from "../../services/departmentService.js";
import DepartmentFormModal from "./DepartmentFormModal.jsx";

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

const EmptyState = ({ hasSearch, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
      <Building2 className="w-7 h-7 text-slate-500" />
    </div>
    <h3 className="text-white font-semibold mb-1">
      {hasSearch ? "No departments found" : "No departments yet"}
    </h3>
    <p className="text-slate-400 text-sm mb-4">
      {hasSearch
        ? "Try a different search term or clear the filter."
        : "Add your first academic department to get started."}
    </p>
    {!hasSearch && (
      <button
        id="empty-add-dept-btn"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Department
      </button>
    )}
  </div>
);

const DeleteConfirm = ({ department, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
      <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <h3 className="text-white font-semibold mb-1">Delete department?</h3>
      <p className="text-slate-400 text-sm mb-5">
        This will permanently remove{" "}
        <span className="text-white font-medium">{department?.name}</span> (
        {department?.code}). Make sure no active classes or students are assigned.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          id="confirm-delete-dept-btn"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

const DepartmentsPage = () => {
  const [departments, setDepartments]         = useState([]);
  const [pagination, setPagination]           = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen]             = useState(false);
  const [editingDept, setEditingDept]         = useState(null);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleting, setDeleting]               = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDepartments({ search: debouncedSearch });
      setDepartments(result.departments || []);
      setPagination(result.pagination || { total: result.departments?.length || 0, page: 1, totalPages: 1 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDepartment(deleteTarget._id);
      toast.success("Department deleted");
      setDeleteTarget(null);
      loadDepartments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Departments</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {departments.length} academic department{departments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          id="add-dept-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="dept-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by department name or code…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : departments.length === 0 ? (
          <EmptyState hasSearch={Boolean(debouncedSearch)} onAdd={handleOpenAdd} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Classes</th>
                  <th className="px-6 py-4 text-center">Students</th>
                  <th className="px-6 py-4 text-center">Faculty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">
                      {dept.code}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {dept.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate text-xs">
                      {dept.description || <span className="text-slate-600">—</span>}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                        {dept.stats?.classes ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                        {dept.stats?.students ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                        {dept.stats?.teachers ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge isActive={dept.isActive} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`edit-dept-${dept._id}`}
                          onClick={() => handleOpenEdit(dept)}
                          title="Edit department"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-dept-${dept._id}`}
                          onClick={() => setDeleteTarget(dept)}
                          title="Delete department"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
        )}
      </div>

      <DepartmentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        department={editingDept}
        onSuccess={loadDepartments}
      />

      {deleteTarget && (
        <DeleteConfirm
          department={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
