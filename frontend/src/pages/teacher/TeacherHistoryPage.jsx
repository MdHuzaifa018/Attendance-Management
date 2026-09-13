import { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  X,
  CheckCircle,
  XCircle,
  ClipboardList,
  AlertCircle,
  RotateCcw,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAttendanceSessions, getSessionDetail, correctAttendance } from "../../services/attendanceHistoryService.js";
import { getClasses, getSubjectsByClass } from "../../services/attendanceService.js";

/* ─── helpers ────────────────────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

/* ─── Stat card ──────────────────────────────────────────────────── */
const StatChip = ({ label, value, color }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold
      ${color === "green" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : ""}
      ${color === "red"   ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : ""}
      ${color === "blue"  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : ""}
    `}
  >
    {label}: <strong>{value}</strong>
  </span>
);

/* ─── Attendance percent bar ─────────────────────────────────────── */
const PctBar = ({ value }) => {
  const color =
    value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-9 text-right">
        {value}%
      </span>
    </div>
  );
};

/* ─── Edit modal ─────────────────────────────────────────────────── */
const EditModal = ({ record, onClose, onSaved }) => {
  const [newStatus, setNewStatus] = useState(record.status);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (newStatus === record.status) {
      toast.error("Status hasn't changed");
      return;
    }
    setSaving(true);
    try {
      await correctAttendance({ attendanceId: record._id, newStatus, reason });
      toast.success(`Corrected: ${record.status} → ${newStatus}`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save correction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Correct Attendance</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 space-y-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{record.student.name}</p>
            <p className="text-xs text-slate-500">Roll No: {record.student.rollNo}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              Current status:
              <span
                className={`ml-1 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${record.status === "present"
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"}`}
              >
                {record.status === "present" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {record.status}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              New Status
            </label>
            <div className="flex gap-3">
              {["present", "absent"].map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                    ${newStatus === s
                      ? s === "present"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400 dark:hover:border-slate-600"
                    }`}
                >
                  {s === "present" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="e.g. Medical certificate submitted..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <p className="text-xs text-slate-400 text-right mt-0.5">{reason.length}/300</p>
          </div>

          {/* Edit history for context */}
          {record.editHistory?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Previous edits
              </p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {record.editHistory.map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {h.changedBy?.name || "Unknown"}
                    </span>{" "}
                    changed {h.previousStatus} → {h.newStatus}
                    {h.reason && <span className="italic ml-1">("{h.reason}")</span>}
                    <span className="ml-1 text-slate-400">• {fmt(h.changedAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || newStatus === record.status}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {saving ? "Saving…" : "Save Correction"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Session detail modal ───────────────────────────────────────── */
const SessionDetailModal = ({ session, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSessionDetail({
        classId: session.class._id,
        subjectId: session.subject._id,
        date: session.date.slice(0, 10),
        session: session.session,
      });
      setDetail(res);
    } catch {
      toast.error("Failed to load session detail");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {session.subject.name}
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({session.subject.code})
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {session.class.name} · {fmt(session.date)} · {session.session}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary row */}
        {detail && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex gap-3 flex-wrap flex-shrink-0">
            <StatChip label="Total" value={detail.summary.total} color="blue" />
            <StatChip label="Present" value={detail.summary.present} color="green" />
            <StatChip label="Absent" value={detail.summary.absent} color="red" />
            <span className="text-xs text-slate-500 self-center ml-auto">
              {pct(detail.summary.present, detail.summary.total)}% attendance
            </span>
          </div>
        )}

        {/* Students list */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !detail?.students?.length ? (
            <p className="text-center text-slate-500 py-8">No records found</p>
          ) : (
            <div className="space-y-2">
              {detail.students.map((row) => (
                <div
                  key={row._id}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">
                    {row.student.rollNo?.toString().split('-').pop() || "–"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {row.student.name}
                    </p>
                    <p className="text-xs text-slate-400">Roll #{row.student.rollNo}</p>
                  </div>

                  <div className="flex flex-col gap-1 items-end mr-2 flex-shrink-0">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      Today: {row.todayAttended ?? 0}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      Overall: {row.totalAttended ?? 0}
                    </span>
                  </div>

                  {row.wasEdited && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium flex-shrink-0">
                      Edited
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0
                      ${row.status === "present"
                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"}`}
                  >
                    {row.status === "present" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {row.status}
                  </span>

                  <button
                    onClick={() => setEditTarget(row)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex-shrink-0"
                    title="Correct this record"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit modal nested inside */}
      {editTarget && (
        <EditModal
          record={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { setEditTarget(null); load(); }}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TeacherHistoryPage — main component
═══════════════════════════════════════════════════════════════════ */
const TeacherHistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    classId: "",
    subjectId: "",
    startDate: "",
    endDate: "",
    session: "",
    page: 1,
    limit: 15,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewSession, setViewSession] = useState(null);

  // Load filter selects
  useEffect(() => {
    getClasses().then(setClasses).catch(() => {});
  }, []);

  useEffect(() => {
    if (filters.classId) {
      getSubjectsByClass(filters.classId)
        .then(setSubjects)
        .catch(() => setSubjects([]));
    } else {
      setSubjects([]);
    }
  }, [filters.classId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.session) params.session = filters.session;
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await getAttendanceSessions(params);
      setSessions(res.sessions || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch {
      toast.error("Failed to load attendance history");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const resetFilters = () =>
    setFilters({ classId: "", subjectId: "", startDate: "", endDate: "", session: "", page: 1, limit: 15 });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-500" />
            Attendance History
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Browse past sessions, view attendance records, and make authorized corrections
          </p>
        </div>
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors
            ${showFilters
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {(filters.classId || filters.subjectId || filters.startDate || filters.endDate || filters.session) && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>
      </div>

      {/* ── Filters panel ── */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class</label>
              <select
                value={filters.classId}
                onChange={(e) => updateFilter("classId", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">All classes</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={filters.subjectId}
                onChange={(e) => updateFilter("subjectId", e.target.value)}
                disabled={!filters.classId}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
              >
                <option value="">All subjects</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Session</label>
              <select
                value={filters.session}
                onChange={(e) => updateFilter("session", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">All sessions</option>
                <option value="regular">Regular</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
                <option value="extra">Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter("startDate", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Total count ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Loading…" : `${total} session${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* ── Sessions list ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center py-20 gap-3">
          <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 font-medium">No attendance sessions found</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or mark attendance first</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all hover:shadow-sm group"
            >
              <div className="flex items-start gap-4">
                {/* Date block */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center justify-center">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 leading-none">
                    {new Date(s.date).getUTCDate()}
                  </p>
                  <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {new Date(s.date).toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.subject?.name}
                    </h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                      {s.subject?.code}
                    </span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                      {s.session}
                    </span>
                    {s.hasEdits && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                        Has Edits
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {s.class?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {s.presentCount}/{s.totalStudents} present
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {fmt(s.markedAt)}
                    </span>
                  </div>

                  <div className="mt-2 max-w-xs">
                    <PctBar value={s.attendancePercent} />
                  </div>
                </div>

                <button
                  onClick={() => setViewSession(s)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {filters.page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={filters.page >= totalPages}
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {viewSession && (
        <SessionDetailModal session={viewSession} onClose={() => setViewSession(null)} />
      )}
    </div>
  );
};

export default TeacherHistoryPage;
