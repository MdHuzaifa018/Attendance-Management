import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Tag,
  X,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { getNotices, createNotice, deleteNotice } from "../services/noticeService.js";
import { useAuth } from "../context/AuthContext.jsx";

const NoticeBoardWidget = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "normal",
    targetRole: "all",
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getNotices();
      setNotices(data);
    } catch {
      // quiet fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return toast.error("Please enter a title and content");
    }

    try {
      setSubmitting(true);
      await createNotice(formData);
      toast.success("Notice broadcasted successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        content: "",
        category: "General",
        priority: "normal",
        targetRole: "all",
      });
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await deleteNotice(id);
      toast.success("Notice deleted");
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to delete notice");
    }
  };

  const priorityStyles = {
    urgent: "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse",
    high: "bg-amber-500/10 border-amber-500/30 text-amber-500",
    normal: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Notice Board & Circulars
              {notices.some((n) => n.priority === "urgent") && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">Official college notifications & academic alerts</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Post Notice
          </button>
        )}
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          No current announcements. Check back later.
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-all flex flex-col gap-2 relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      priorityStyles[notice.priority] || priorityStyles.normal
                    }`}
                  >
                    {notice.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                    {notice.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-[10px] font-semibold capitalize">
                    {notice.targetRole === "all" ? "Everyone" : notice.targetRole === "student" ? "Students" : "Teachers"}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1 cursor-pointer"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {notice.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Admin Post Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" /> Broadcast New Notice
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mid-Term Examination Guidelines"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 shadow-sm cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 shadow-sm cursor-pointer"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Audience</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 shadow-sm cursor-pointer"
                  >
                    <option value="all">Everyone</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write details of the circular..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoardWidget;
