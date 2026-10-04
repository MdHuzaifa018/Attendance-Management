import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAcademicSessions, createSession, updateSession, deleteSession } from "../../services/academicSessionService.js";
import { CheckCircle, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useSession } from "../../context/SessionContext.jsx";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading, confirmText, isDanger }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className={`w-10 h-10 border rounded-xl flex items-center justify-center mb-4 ${
          isDanger 
            ? "bg-red-50 dark:bg-red-600/20 border-red-200 dark:border-red-500/30" 
            : "bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/30"
        }`}>
          <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-red-600 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"}`} />
        </div>
        <h3 className="text-slate-900 dark:text-white font-semibold mb-1">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${
              isDanger ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AcademicSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, session: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { refreshSessions } = useSession(); // Refresh context sessions on change

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAcademicSessions();
      setSessions(data);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      let latestYear = 2024;
      if (sessions && sessions.length > 0) {
         latestYear = Math.max(...sessions.map(s => s.startYear));
      }
      const nextStart = latestYear + 1;
      const nextEnd = nextStart + 1;
      const name = `${nextStart}-${nextEnd.toString().slice(-2)}`;

      await createSession({
        name: name,
        startYear: nextStart,
        endYear: nextEnd,
        startDate: `${nextStart}-07-01`,
        endDate: `${nextEnd}-06-30`,
        isCurrent: false, // Created as upcoming session
      });
      toast.success(`New Session ${name} Created!`);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create session");
    }
  };

  const handleActivateConfirm = async () => {
    setActionLoading(true);
    try {
      await updateSession(confirmModal.session._id, { isCurrent: true });
      toast.success(`${confirmModal.session.name} is now the active session`);
      fetchSessions();
      refreshSessions(); // tell SessionContext to reload globally
      setConfirmModal({ isOpen: false, type: null, session: null });
    } catch (err) {
      toast.error("Failed to activate session");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await deleteSession(confirmModal.session._id);
      toast.success(`Session ${confirmModal.session.name} deleted successfully`);
      fetchSessions();
      setConfirmModal({ isOpen: false, type: null, session: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete session");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Academic Sessions</h1>
        <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg font-medium">
          Create Next Year Session
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4">
        {loading ? (
          <p className="dark:text-white">Loading...</p>
        ) : (
          <table className="w-full text-left dark:text-white">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="py-2">Name</th>
                <th className="py-2">Duration</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} className="border-b dark:border-slate-800">
                  <td className="py-3 font-semibold">{s.name}</td>
                  <td className="py-3">{s.startYear} - {s.endYear}</td>
                  <td className="py-3">
                    {s.isCurrent ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold border border-green-200 dark:border-green-500/30">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">Inactive</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {!s.isCurrent && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, type: 'activate', session: s })}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Set as Active Session"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setConfirmModal({ isOpen: true, type: 'delete', session: s })}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Session"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reusable Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'activate' ? "Activate Session" : "Delete Session"}
        message={
          confirmModal.type === 'activate'
            ? `Are you sure you want to activate the ${confirmModal.session?.name} session? This will become the default active academic year for the entire system.`
            : `WARNING: Are you sure you want to delete the ${confirmModal.session?.name} session? This will also delete any empty classes created for it. It cannot be deleted if there are any student enrollments.`
        }
        confirmText={confirmModal.type === 'activate' ? "Activate" : "Delete"}
        isDanger={confirmModal.type === 'delete'}
        loading={actionLoading}
        onConfirm={confirmModal.type === 'activate' ? handleActivateConfirm : handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, session: null })}
      />
    </div>
  );
};

export default AcademicSessionsPage;
