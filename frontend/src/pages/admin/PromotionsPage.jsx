import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  RotateCcw,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowUpRight,
  Calendar,
  School,
  Loader2,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { getClasses } from "../../services/classService.js";
import { getAcademicSessions } from "../../services/academicSessionService.js";
import { getPromotionPreview, executePromotion } from "../../services/promotionService.js";
import { useSession } from "../../context/SessionContext.jsx";

const PromotionsPage = () => {
  const { globalSession } = useSession();

  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [targetSessionId, setTargetSessionId] = useState("");
  const [fromClassId, setFromClassId] = useState("");

  const [preview, setPreview] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [targetClasses, setTargetClasses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Search & Filter in Preview
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  useEffect(() => {
    const init = async () => {
      try {
        const [sessData, classData] = await Promise.all([
          getAcademicSessions(),
          getClasses({ all: true }),
        ]);
        setSessions(sessData || []);
        setClasses(classData.classes || []);

        // Pre-select current session if available
        if (globalSession?._id) {
          setCurrentSessionId(globalSession._id);
        } else if (sessData?.length > 0) {
          const current = sessData.find((s) => s.isCurrent) || sessData[0];
          setCurrentSessionId(current._id);
        }
      } catch (err) {
        toast.error("Failed to load initial session data");
      }
    };
    init();
  }, [globalSession]);

  // When current session changes, auto-suggest target session (the next chronological session)
  useEffect(() => {
    if (!currentSessionId || sessions.length === 0) return;
    const currentIndex = sessions.findIndex((s) => String(s._id) === String(currentSessionId));
    if (currentIndex !== -1 && currentIndex < sessions.length - 1) {
      setTargetSessionId(sessions[currentIndex + 1]._id);
    } else {
      setTargetSessionId("");
    }
  }, [currentSessionId, sessions]);

  // Classes filtered by current session
  const availableFromClasses = useMemo(() => {
    if (!currentSessionId) return [];
    return classes.filter(
      (c) => String(c.academicSession?._id || c.academicSession) === String(currentSessionId)
    );
  }, [currentSessionId, classes]);

  // Handle generating preview
  const handleGeneratePreview = async () => {
    if (!currentSessionId || !targetSessionId || !fromClassId) {
      toast.error("Please select current session, target session, and a source class");
      return;
    }
    if (currentSessionId === targetSessionId) {
      toast.error("Target session must be different from current session");
      return;
    }

    setLoading(true);
    try {
      const data = await getPromotionPreview({ currentSessionId, targetSessionId, fromClassId });
      setPreview(data);
      setStudentsList(data.preview || []);
      setTargetClasses(data.availableTargetClasses || []);
      setSearchTerm("");
      setFilterAction("all");
      toast.success(`Loaded ${data.preview?.length || 0} students for promotion review`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to generate promotion preview");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  // Modify individual student's proposed action
  const handleUpdateStudentAction = (index, newAction) => {
    setStudentsList((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };
      target.proposedAction = newAction;

      if (newAction === "graduated") {
        target.proposedClassId = null;
        target.proposedYear = null;
      } else if (newAction === "year_repeat") {
        target.proposedYear = target.currentYear;
        // Keep in equivalent class or same level
      } else if (newAction === "promoted") {
        target.proposedYear = (target.currentYear || 1) + 1;
        // Assign default next class if available
        if (targetClasses.length > 0 && !target.proposedClassId) {
          target.proposedClassId = targetClasses[0]._id;
        }
      }
      copy[index] = target;
      return copy;
    });
  };

  // Modify individual student's target class
  const handleUpdateStudentClass = (index, targetClassId) => {
    setStudentsList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], proposedClassId: targetClassId };
      return copy;
    });
  };

  // Bulk set action for all filtered students
  const handleBulkSetAction = (action) => {
    setStudentsList((prev) =>
      prev.map((s) => ({
        ...s,
        proposedAction: action,
        proposedClassId: action === "graduated" ? null : (s.proposedClassId || (targetClasses[0]?._id ?? null)),
        proposedYear: action === "graduated" ? null : action === "year_repeat" ? s.currentYear : (s.currentYear || 1) + 1,
      }))
    );
    toast.success(`Set all candidates to "${action.toUpperCase()}"`);
  };

  // Execute promotion
  const handleExecute = async () => {
    if (!studentsList || studentsList.length === 0) return;
    setExecuting(true);
    try {
      await executePromotion({
        currentSessionId,
        targetSessionId,
        promotions: studentsList,
      });
      toast.success("Cohort promotion executed successfully!");
      setShowConfirmModal(false);
      setPreview(null);
      setStudentsList([]);
      setFromClassId("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to execute promotion");
    } finally {
      setExecuting(false);
    }
  };

  // Filtered students for display
  const filteredStudents = useMemo(() => {
    let list = studentsList;
    if (filterAction !== "all") {
      list = list.filter((s) => s.proposedAction === filterAction);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.rollNo?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [studentsList, filterAction, searchTerm]);

  // Metrics
  const metrics = useMemo(() => {
    const total = studentsList.length;
    const promoted = studentsList.filter((s) => s.proposedAction === "promoted").length;
    const repeat = studentsList.filter((s) => s.proposedAction === "year_repeat").length;
    const graduated = studentsList.filter((s) => s.proposedAction === "graduated").length;
    return { total, promoted, repeat, graduated };
  }, [studentsList]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Top Hero Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold tracking-wide uppercase text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Session Migration & Progression
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Promotions & Graduation Wizard
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Seamlessly advance eligible student cohorts to the next academic session, retain year-repeats, or graduate final-year batches into Alumni with full atomic transaction safety.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <ShieldCheck className="w-8 h-8 text-emerald-300" />
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Zero Data Loss</p>
                <p className="text-xs text-indigo-100">Rollback & Audit Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wizard Step 1: Configuration Form ─────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm transition-all">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Configure Promotion Cohort
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the source academic session, target destination session, and class cohort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Source Session */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              From Session (Current) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={currentSessionId}
                onChange={(e) => {
                  setCurrentSessionId(e.target.value);
                  setFromClassId("");
                  setPreview(null);
                }}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">Select source session...</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.isCurrent ? "★ (Active Year)" : ""}
                  </option>
                ))}
              </select>
              <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Target Session */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              To Session (Next Year) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={targetSessionId}
                onChange={(e) => {
                  setTargetSessionId(e.target.value);
                  setPreview(null);
                }}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">Select target session...</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.isCurrent ? "★ (Active Year)" : ""}
                  </option>
                ))}
              </select>
              <ArrowRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Source Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Class Cohort <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={fromClassId}
                onChange={(e) => {
                  setFromClassId(e.target.value);
                  setPreview(null);
                }}
                disabled={!currentSessionId || availableFromClasses.length === 0}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="">
                  {availableFromClasses.length === 0
                    ? "No classes in this session"
                    : "Select class to promote..."}
                </option>
                {availableFromClasses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <School className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            Final semester students are automatically proposed for graduation into Alumni.
          </p>

          <button
            onClick={handleGeneratePreview}
            disabled={loading || !currentSessionId || !targetSessionId || !fromClassId}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Cohort...
              </>
            ) : (
              <>
                Generate Preview
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Wizard Step 2: Cohort Review & Overrides ─────────────────── */}
      {preview && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Review & Customize Proposed Actions
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {preview.fromClass?.name} ({preview.fromClass?.code})
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify individual student outcomes. You can override actions or re-assign specific classes.
                </p>
              </div>
            </div>

            {/* Quick Batch Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium mr-1">Batch Actions:</span>
              <button
                onClick={() => handleBulkSetAction("promoted")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                All Promoted
              </button>
              <button
                onClick={() => handleBulkSetAction("year_repeat")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                All Repeat
              </button>
              <button
                onClick={() => handleBulkSetAction("graduated")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                All Graduated
              </button>
            </div>
          </div>

          {/* ── KPI Metric Badges ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-semibold">Total Candidates</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {metrics.total}
              </p>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
                <span className="text-xs font-semibold">Advancing</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {metrics.promoted}
              </p>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
                <span className="text-xs font-semibold">Year Repeat</span>
                <RotateCcw className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {metrics.repeat}
              </p>
            </div>

            <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-1">
                <span className="text-xs font-semibold">Graduating</span>
                <GraduationCap className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-300">
                {metrics.graduated}
              </p>
            </div>
          </div>

          {/* ── Toolbar: Search & Action Filter ─────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { id: "all", label: "All" },
                  { id: "promoted", label: "Promoted" },
                  { id: "year_repeat", label: "Repeat" },
                  { id: "graduated", label: "Graduated" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterAction(tab.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterAction === tab.id
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Table of Students ────────────────────────────────────────── */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Roll No</th>
                    <th className="py-3.5 px-4 font-bold">Candidate Name</th>
                    <th className="py-3.5 px-4 font-bold">Current Level</th>
                    <th className="py-3.5 px-4 font-bold">Proposed Action</th>
                    <th className="py-3.5 px-4 font-bold">Destination Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                        No students match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const origIndex = studentsList.findIndex((x) => x.enrollmentId === st.enrollmentId);
                      return (
                        <tr
                          key={st.enrollmentId}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {st.rollNo || "—"}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {st.name || "Student"}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                            Year {st.currentYear || 1}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={st.proposedAction}
                              onChange={(e) => handleUpdateStudentAction(origIndex, e.target.value)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                st.proposedAction === "promoted"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                  : st.proposedAction === "year_repeat"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                                  : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                              }`}
                            >
                              <option value="promoted">Promote (Next Year)</option>
                              <option value="year_repeat">Retain (Year Repeat)</option>
                              <option value="graduated">Graduate (Alumni)</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {st.proposedAction === "graduated" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-lg">
                                <GraduationCap className="w-3.5 h-3.5" /> Alumni Directory
                              </span>
                            ) : targetClasses.length > 0 ? (
                              <select
                                value={st.proposedClassId || ""}
                                onChange={(e) => handleUpdateStudentClass(origIndex, e.target.value)}
                                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                              >
                                {targetClasses.map((tc) => (
                                  <option key={tc._id} value={tc._id}>
                                    {tc.name} ({tc.code})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" /> No target class defined
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Wizard Step 3: Execute Action Bar ──────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Ready to process <strong>{metrics.total}</strong> records into session{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {preview.targetSession?.name}
                </span>.
              </span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={executing || studentsList.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Execute Promotions
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal ────────────────────────────────────────── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Execute Cohort Progression?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This transaction will advance candidate enrollments into{" "}
                  <strong>{preview?.targetSession?.name}</strong>.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Source Class:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {preview?.fromClass?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidates to Advance:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {metrics.promoted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidates to Retain:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {metrics.repeat}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidates to Graduate:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {metrics.graduated}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={executing}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={executing}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {executing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  "Yes, Proceed"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
