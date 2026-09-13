import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Loader2,
  X,
  FileCheck,
  Building2,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { applyLeave, getMyLeaves, getAllLeaves, reviewLeave } from "../services/leaveService.js";
import { useAuth } from "../context/AuthContext.jsx";

const LeaveManagementModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [activeTab, setActiveTab] = useState(isStudent ? "apply" : "review");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Student apply form
  const [formData, setFormData] = useState({
    leaveType: "Medical",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const loadLeaves = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const data = await getMyLeaves();
        setLeaves(data);
      } else {
        const data = await getAllLeaves();
        setLeaves(data);
      }
    } catch {
      // quiet error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLeaves();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      return toast.error("Please fill in all leave details");
    }

    try {
      setSubmitting(true);
      await applyLeave(formData);
      toast.success("Leave application submitted for approval!");
      setFormData({
        leaveType: "Medical",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setActiveTab("history");
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit leave application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (id, status) => {
    const note = window.prompt(`Enter optional note for ${status}:`) || "";
    try {
      await reviewLeave(id, status, note);
      toast.success(`Leave request marked as ${status}`);
      loadLeaves();
    } catch {
      toast.error("Failed to update leave status");
    }
  };

  const statusBadge = (st) => {
    switch (st) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-500">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              {isStudent ? "Student Leave Portal" : "Faculty Leave Approval Desk"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs for students */}
        {isStudent && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-6">
            <button
              onClick={() => setActiveTab("apply")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "apply"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Apply For Leave
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              My Applied Leaves ({leaves.length})
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {isStudent && activeTab === "apply" ? (
            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Approved leaves ensure your attendance shortage is legitimately accounted for
                  during semester exam clearance. Please provide accurate dates and doctor or
                  institutional notes.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Leave Category</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="Medical" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Medical / Sickness</option>
                  <option value="Academic" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Academic Symposium / Seminar</option>
                  <option value="Casual" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Casual / Personal Emergency</option>
                  <option value="Emergency" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Family Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why you are requesting leave..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Leave Application
              </button>
            </form>
          ) : (
            // Leave History & Admin Review List
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                </div>
              ) : leaves.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
                  No leave applications recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {leaves.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-col gap-2.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          {!isStudent && item.student && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {item.student.user?.name}
                              </span>
                              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded">
                                Roll #{item.student.rollNo}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                ({item.student.class?.name})
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                              {item.leaveType}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.startDate).toLocaleDateString("en-IN")} —{" "}
                              {new Date(item.endDate).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <div>{statusBadge(item.status)}</div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                        {item.reason}
                      </p>

                      {item.reviewNote && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-300 italic">
                          Feedback: "{item.reviewNote}"
                        </p>
                      )}

                      {/* Admin/Teacher Action Buttons */}
                      {!isStudent && item.status === "pending" && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                          <button
                            onClick={() => handleReview(item._id, "rejected")}
                            className="px-3 py-1 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleReview(item._id, "approved")}
                            className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementModal;
