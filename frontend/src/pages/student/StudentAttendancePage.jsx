import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  User,
  Calendar,
  Award,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAttendanceSummary,
  getAttendanceTimeline,
} from "../../services/studentAttendanceService.js";

/* ─── helpers ────────────────────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const statusConfig = {
  good:     { label: "Good",     color: "emerald", bg: "bg-emerald-500" },
  warning:  { label: "Low",      color: "amber",   bg: "bg-amber-500" },
  critical: { label: "Critical", color: "red",     bg: "bg-red-500" },
};

/* ─── Circular gauge ─────────────────────────────────────────────── */
const CircularGauge = ({ percent, status, size = 140 }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const strokeColor =
    status === "good" ? "#10b981" : status === "warning" ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        strokeWidth="10" className="text-slate-200 dark:text-slate-700" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={strokeColor}
        strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="text-2xl font-extrabold"
        fill={strokeColor}
        style={{ fontSize: 22, fontWeight: 800, transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {percent}%
      </text>
    </svg>
  );
};

/* ─── Linear percent bar ─────────────────────────────────────────── */
const PctBar = ({ value, status }) => {
  const barColor =
    status === "good" ? "bg-emerald-500" : status === "warning" ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-sm font-bold w-10 text-right
        ${status === "good" ? "text-emerald-600 dark:text-emerald-400"
          : status === "warning" ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400"}`}>
        {value}%
      </span>
    </div>
  );
};

/* ─── Subject card ───────────────────────────────────────────────── */
const SubjectCard = ({ subj, onClick }) => {
  const cfg = statusConfig[subj.status];
  return (
    <button
      onClick={() => onClick(subj)}
      className={`w-full text-left bg-white dark:bg-slate-900 border rounded-2xl p-5
        hover:shadow-md transition-all duration-200 group
        ${subj.status === "good"
          ? "border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600"
          : subj.status === "warning"
          ? "border-amber-200 dark:border-amber-800/60 hover:border-amber-400 dark:hover:border-amber-600"
          : "border-red-200 dark:border-red-800/60 hover:border-red-400 dark:hover:border-red-600"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            {subj.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{subj.code}</p>
        </div>
        <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold
          ${subj.status === "good" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
            : subj.status === "warning" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
            : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"}`}>
          {cfg.label}
        </span>
      </div>

      {/* Progress bar */}
      <PctBar value={subj.percent} status={subj.status} />

      {/* Stats row */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <span>{subj.attended}/{subj.totalConducted} classes</span>
        <span>{subj.absent} absent</span>
      </div>

      {/* Advisory */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {subj.status === "good" ? (
          <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Can miss {subj.canMiss} more class{subj.canMiss !== 1 ? "es" : ""} safely
          </p>
        ) : subj.status === "critical" ? (
          <p className="text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            Need {subj.classesNeeded} consecutive class{subj.classesNeeded !== 1 ? "es" : ""} to recover
          </p>
        ) : (
          <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
            Attend {subj.classesNeeded} more to reach 75%
          </p>
        )}
      </div>

      {/* Teacher */}
      <p className="text-xs text-slate-400 mt-2">
        <span className="text-slate-500">By:</span> {subj.teacher}
      </p>
    </button>
  );
};

/* ─── Timeline record row ────────────────────────────────────────── */
const TimelineRow = ({ record }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
    ${record.status === "present"
      ? "bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/30"
      : "bg-red-50/60 dark:bg-red-900/10 border border-red-200/60 dark:border-red-800/30"}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
      ${record.status === "present"
        ? "bg-emerald-100 dark:bg-emerald-900/40"
        : "bg-red-100 dark:bg-red-900/40"}`}>
      {record.status === "present"
        ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        : <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
        {record.subject?.name}
      </p>
      <p className="text-xs text-slate-400">
        {record.subject?.code} · {record.session}
      </p>
    </div>

    <div className="text-right flex-shrink-0">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {fmt(record.date)}
      </p>
      <span className={`text-xs font-semibold capitalize
        ${record.status === "present"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400"}`}>
        {record.status}
      </span>
    </div>
  </div>
);

/* ─── Stat overview card ─────────────────────────────────────────── */
const OverviewCard = ({ label, value, sub, icon: Icon, color }) => {
  const colors = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/50",
  };
  return (
    <div className={`border rounded-2xl p-4 ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      </div>
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   StudentAttendancePage — main component
═══════════════════════════════════════════════════════════════════ */
const StudentAttendancePage = () => {
  const [tab, setTab] = useState("summary"); // "summary" | "timeline"
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Timeline state
  const [timeline, setTimeline] = useState([]);
  const [tlTotal, setTlTotal] = useState(0);
  const [tlPages, setTlPages] = useState(1);
  const [loadingTl, setLoadingTl] = useState(false);
  const [tlFilters, setTlFilters] = useState({
    subjectId: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Selected subject for drill-down in timeline
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Load summary
  useEffect(() => {
    setLoadingSummary(true);
    getAttendanceSummary()
      .then(setSummary)
      .catch(() => toast.error("Failed to load attendance summary"))
      .finally(() => setLoadingSummary(false));
  }, []);

  // Load timeline
  const loadTimeline = useCallback(async () => {
    setLoadingTl(true);
    try {
      const params = {};
      if (tlFilters.subjectId) params.subjectId = tlFilters.subjectId;
      if (tlFilters.startDate) params.startDate = tlFilters.startDate;
      if (tlFilters.endDate) params.endDate = tlFilters.endDate;
      params.page = tlFilters.page;
      params.limit = tlFilters.limit;

      const res = await getAttendanceTimeline(params);
      setTimeline(res.records || []);
      setTlTotal(res.total || 0);
      setTlPages(res.totalPages || 1);
    } catch {
      toast.error("Failed to load attendance timeline");
    } finally {
      setLoadingTl(false);
    }
  }, [tlFilters]);

  useEffect(() => {
    if (tab === "timeline") loadTimeline();
  }, [tab, loadTimeline]);

  const updateTlFilter = (key, value) =>
    setTlFilters((p) => ({ ...p, [key]: value, page: 1 }));

  const resetTlFilters = () =>
    setTlFilters({ subjectId: "", startDate: "", endDate: "", page: 1, limit: 20 });

  // When clicking a subject card — switch to timeline filtered by that subject
  const handleSubjectClick = (subj) => {
    setSelectedSubject(subj);
    setTlFilters((p) => ({ ...p, subjectId: subj._id, page: 1 }));
    setTab("timeline");
  };

  const overview = summary?.overview;
  const student = summary?.student;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-violet-500" />
            My Attendance
          </h1>
          {student && (
            <p className="text-sm text-slate-500 mt-0.5">
              {student.class?.name} · {student.department?.name} · Roll #{student.rollNo}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="sm:ml-auto flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-fit">
          {["summary", "timeline"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                ${tab === t
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            >
              {t === "summary" ? "Overview" : "History"}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ SUMMARY TAB ═══ */}
      {tab === "summary" && (
        <>
          {loadingSummary ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !summary ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center py-20 gap-3">
              <User className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 font-medium">No attendance data found</p>
              <p className="text-xs text-slate-400">Your teacher hasn't marked any attendance yet</p>
            </div>
          ) : (
            <>
              {/* ── Overall gauge + stats ── */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Gauge */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="relative">
                      <CircularGauge
                        percent={overview.overallPercent}
                        status={overview.overallStatus}
                        size={148}
                      />
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full
                      ${overview.overallStatus === "good"
                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        : overview.overallStatus === "warning"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"}`}>
                      {statusConfig[overview.overallStatus].label}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Overall Attendance</p>
                  </div>

                  {/* Stats grid */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                    <OverviewCard
                      label="Classes Attended"
                      value={overview.totalAttended}
                      sub={`of ${overview.totalConducted} conducted`}
                      icon={CheckCircle}
                      color="emerald"
                    />
                    <OverviewCard
                      label="Absences"
                      value={overview.totalAbsent}
                      sub="total missed"
                      icon={XCircle}
                      color="red"
                    />
                    <OverviewCard
                      label="Subjects"
                      value={overview.subjectCount}
                      sub="enrolled"
                      icon={BookOpen}
                      color="indigo"
                    />
                    <OverviewCard
                      label="Overall %"
                      value={`${overview.overallPercent}%`}
                      sub={overview.overallPercent >= 75 ? "Exam eligible" : "Below 75% threshold"}
                      icon={Award}
                      color="violet"
                    />
                  </div>
                </div>

                {/* 75% threshold bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Overall attendance</span>
                    <span className="font-semibold">75% minimum required</span>
                  </div>
                  <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700
                        ${overview.overallStatus === "good" ? "bg-emerald-500" : overview.overallStatus === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(overview.overallPercent, 100)}%` }}
                    />
                    {/* 75% marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white opacity-30" style={{ left: "75%" }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                    <span>0%</span>
                    <span className="text-slate-500 font-semibold">75% ↑</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* ── Eligibility alert ── */}
              {overview.overallStatus !== "good" && (
                <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl border
                  ${overview.overallStatus === "critical"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/60"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/60"}`}>
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5
                    ${overview.overallStatus === "critical" ? "text-red-500" : "text-amber-500"}`} />
                  <div>
                    <p className={`text-sm font-bold
                      ${overview.overallStatus === "critical" ? "text-red-800 dark:text-red-200" : "text-amber-800 dark:text-amber-200"}`}>
                      {overview.overallStatus === "critical"
                        ? "Attendance Critically Low — Exam Eligibility at Risk"
                        : "Attendance Below 75% — Improvement Required"}
                    </p>
                    <p className={`text-xs mt-1
                      ${overview.overallStatus === "critical" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                      You currently have {overview.overallPercent}% attendance. You must reach at least 75% to be eligible for exams. Attend all upcoming classes.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Subject cards ── */}
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Subject-wise Breakdown
                  <span className="ml-2 text-xs font-normal text-slate-400">Click a subject to view its history</span>
                </h2>
                {summary.subjects.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center py-12 gap-2">
                    <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 text-sm">No subjects found for your class</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {summary.subjects.map((subj) => (
                      <SubjectCard key={subj._id} subj={subj} onClick={handleSubjectClick} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ═══ TIMELINE TAB ═══ */}
      {tab === "timeline" && (
        <>
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {selectedSubject && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                {selectedSubject.name}
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    updateTlFilter("subjectId", "");
                  }}
                  className="ml-1 hover:text-violet-900 dark:hover:text-violet-100 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors
                ${showFilters
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <p className="text-sm text-slate-500 sm:ml-auto">
              {loadingTl ? "Loading…" : `${tlTotal} record${tlTotal !== 1 ? "s" : ""}`}
            </p>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Subject filter from summary data */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={tlFilters.subjectId}
                    onChange={(e) => { updateTlFilter("subjectId", e.target.value); setSelectedSubject(null); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  >
                    <option value="">All subjects</option>
                    {summary?.subjects?.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">From Date</label>
                  <input type="date" value={tlFilters.startDate} onChange={(e) => updateTlFilter("startDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">To Date</label>
                  <input type="date" value={tlFilters.endDate} onChange={(e) => updateTlFilter("endDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                </div>
                <div className="flex items-end">
                  <button onClick={() => { resetTlFilters(); setSelectedSubject(null); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline records */}
          {loadingTl ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : timeline.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center py-20 gap-3">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 font-medium">No attendance records found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {timeline.map((record) => (
                <TimelineRow key={record._id} record={record} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {tlPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Page {tlFilters.page} of {tlPages}</p>
              <div className="flex gap-2">
                <button
                  disabled={tlFilters.page <= 1}
                  onClick={() => setTlFilters((p) => ({ ...p, page: p.page - 1 }))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={tlFilters.page >= tlPages}
                  onClick={() => setTlFilters((p) => ({ ...p, page: p.page + 1 }))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentAttendancePage;
