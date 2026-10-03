import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Users,
  GraduationCap,
  TrendingUp,
  Activity,
  CalendarDays,
  FileCheck,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  School,
} from "lucide-react";
import NoticeBoardWidget from "../../components/NoticeBoardWidget.jsx";
import LeaveManagementModal from "../../components/LeaveManagementModal.jsx";
import TimetableWidget from "../../components/TimetableWidget.jsx";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import toast from "react-hot-toast";
import {
  getSystemOverview,
  getAttendanceTrends,
  downloadCSVReport,
  getAtRiskStudentsDetails,
} from "../../services/reportService.js";
import { getTeachers } from "../../services/teacherService.js";
import { getStudents } from "../../services/studentService.js";
import { getAttendanceSessions } from "../../services/attendanceHistoryService.js";
import { getAcademicSessions } from "../../services/academicSessionService.js";

// Donut Chart Colors
const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b"]; // Present, Absent, Other

// Helper component for Executive KPI Cards
const AnalystKpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor,
  trend,
  colorScheme = "indigo",
  progress,
  onClick,
}) => {
  const schemes = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-100 dark:border-indigo-900/40",
      icon: "text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40",
      progress: "bg-indigo-600 dark:bg-indigo-500",
    },
    emerald: {
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
      border: "border-emerald-100 dark:border-emerald-900/40",
      icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40",
      progress: "bg-emerald-600 dark:bg-emerald-500",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-100 dark:border-violet-900/40",
      icon: "text-violet-600 dark:text-violet-400 bg-violet-100/60 dark:bg-violet-900/40",
      progress: "bg-violet-600 dark:bg-violet-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-100 dark:border-amber-900/40",
      icon: "text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/40",
      progress: "bg-amber-500 dark:bg-amber-400",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-100 dark:border-rose-900/40",
      icon: "text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-900/40",
      progress: "bg-rose-600 dark:bg-rose-500",
    },
  };

  const scheme = schemes[colorScheme] || schemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-bold ${
                  trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {trend > 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${scheme.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {progress !== undefined && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scheme.progress}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate">{subtitle}</span>
          {badgeText && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor} shrink-0`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [timeframe, setTimeframe] = useState(7); // 7, 14, 30 days
  const [metricMode, setMetricMode] = useState("percent"); // "percent" | "volume"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [drillDown, setDrillDown] = useState({ isOpen: false, type: null, loading: false, data: [] });

  // Session State
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    const initSessions = async () => {
      try {
        const data = await getAcademicSessions();
        setSessions(data);
        const active = data.find((s) => s.isCurrent);
        if (active) setSelectedSession(active._id);
      } catch (err) {
        toast.error("Failed to load academic sessions");
      }
    };
    initSessions();
  }, []);

  // Fetch dashboard analytical data
  const fetchData = async (days = timeframe, sessionId = selectedSession, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [overviewRes, trendsRes] = await Promise.all([
        getSystemOverview(sessionId),
        getAttendanceTrends(days),
      ]);
      setOverview(overviewRes);
      setTrends(trendsRes || []);
      if (isManualRefresh) {
        toast.success("Dashboard refreshed!");
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(timeframe, selectedSession);
  }, [timeframe, selectedSession]);

  // Handle CSV export
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await downloadCSVReport();
      toast.success("CSV report downloaded!");
    } catch {
      toast.error("Failed to download CSV report");
    } finally {
      setExporting(false);
    }
  };

  // Handle drill-down clicks
  const handleCardClick = async (type) => {
    if (type === "teachers") {
      setDrillDown({ isOpen: true, type, loading: true, data: [] });
      try {
        const res = await getTeachers({ limit: 200 }); // Fetch more for modal
        setDrillDown({ isOpen: true, type, loading: false, data: res.teachers || [] });
      } catch (err) {
        toast.error("Failed to fetch teachers");
        setDrillDown((prev) => ({ ...prev, loading: false }));
      }
    } else if (type === "students") {
      setDrillDown({ isOpen: true, type, loading: true, data: [] });
      try {
        const res = await getStudents({ limit: 1000 }); // Fetch up to 1000 for modal
        setDrillDown({ isOpen: true, type, loading: false, data: res.students || [] });
      } catch (err) {
        toast.error("Failed to fetch students");
        setDrillDown((prev) => ({ ...prev, loading: false }));
      }
    } else if (type === "today-classes") {
      setDrillDown({ isOpen: true, type, loading: true, data: [] });
      try {
        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const res = await getAttendanceSessions({ startDate: todayStr, endDate: todayStr, limit: 200 });
        setDrillDown({ isOpen: true, type, loading: false, data: res.sessions || [] });
      } catch (err) {
        toast.error("Failed to fetch today's classes");
        setDrillDown((prev) => ({ ...prev, loading: false }));
      }
    } else if (type === "overall") {
      setDrillDown({ 
        isOpen: true, 
        type, 
        loading: false, 
        data: overview?.classBreakdown || [] 
      });
    } else if (type === "at-risk") {
      setDrillDown({ isOpen: true, type, loading: true, data: [] });
      try {
        const data = await getAtRiskStudentsDetails(selectedSession);
        setDrillDown({ isOpen: true, type, loading: false, data });
      } catch (err) {
        toast.error("Failed to fetch at-risk students");
        setDrillDown((prev) => ({ ...prev, loading: false }));
      }
    }
  };

  // Trend Statistics calculation (Peak, Low, Average)
  const trendStats = useMemo(() => {
    if (!trends || trends.length === 0) return { peak: null, low: null, avg: 0, totalVolume: 0 };

    let maxVal = -1;
    let minVal = 101;
    let peakDay = null;
    let lowDay = null;
    let sumPercent = 0;
    let totalVol = 0;

    trends.forEach((t) => {
      const p = t.percent || 0;
      sumPercent += p;
      totalVol += t.total || 0;
      if (p > maxVal) {
        maxVal = p;
        peakDay = t;
      }
      if (p < minVal) {
        minVal = p;
        lowDay = t;
      }
    });

    const avg = trends.length > 0 ? Math.round(sumPercent / trends.length) : 0;
    return { peak: peakDay, low: lowDay, avg, totalVolume: totalVol };
  }, [trends]);

  // Donut chart data: Present vs Absent
  const donutData = useMemo(() => {
    const present = overview?.presentRecords || 0;
    const absent = overview?.absentRecords || 0;
    const total = present + absent;

    if (total === 0) {
      return [
        { name: "Present", value: 1, color: "#10b981" },
        { name: "Absent", value: 0, color: "#ef4444" },
      ];
    }

    return [
      { name: "Present", value: present, color: "#10b981" },
      { name: "Absent", value: absent, color: "#ef4444" },
    ];
  }, [overview]);

  // Class comparison breakdown
  const classBreakdown = useMemo(() => {
    return (overview?.classBreakdown || []).map((c) => ({
      name: c.code || c.name,
      fullName: c.name,
      rate: c.rate || 0,
      total: c.total || 0,
    }));
  }, [overview]);

  // Custom Tooltip for Area Chart
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const dateObj = new Date(label);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      return (
        <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-semibold text-slate-300">{formattedDate}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />
            <span className="font-bold text-sm text-white">
              {metricMode === "percent" ? `${data.percent}% Attendance` : `${data.total} Students`}
            </span>
          </div>
          <div className="pt-1 border-t border-slate-700/60 flex items-center justify-between gap-4 text-slate-400 text-[11px]">
            <span>Attendance: <strong className="text-emerald-400">{data.percent}%</strong></span>
            <span>Total Logged: <strong className="text-indigo-300">{data.total}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Class Bar Chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-sm text-white">{data.fullName || data.name}</p>
          <p className="text-emerald-400 font-semibold">Attendance: {data.rate}%</p>
          <p className="text-slate-400 text-[11px]">Total Records: {data.total}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Top Header & Quick Actions ────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                College Overview
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Updates
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Quick summary of attendance, students, teachers, and daily classes.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            {/* Session Filter */}
            <div className="mr-2">
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              >
                <option value="">All Time (Global)</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.isCurrent ? "(Active)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchData(timeframe, selectedSession, true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-500" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Download CSV Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export CSV"}</span>
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Leave Requests</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* ── 5 Key Summary Cards ──────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <AnalystKpiCard
              title="Overall Attendance"
              value={`${overview?.overallPercent || 0}%`}
              subtitle={`Total Records: ${(overview?.totalRecords || 0).toLocaleString()}`}
              icon={Activity}
              colorScheme="violet"
              progress={overview?.overallPercent || 0}
              badgeText={
                (overview?.overallPercent || 0) >= 75
                  ? "Good (≥75%)"
                  : "Low (<75%)"
              }
              badgeColor={
                (overview?.overallPercent || 0) >= 75
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
              }
              onClick={() => handleCardClick("overall")}
            />

            <AnalystKpiCard
              title="Total Students"
              value={(overview?.studentCount || 0).toLocaleString()}
              subtitle={`In ${overview?.classCount || 0} Classes`}
              icon={Users}
              colorScheme="emerald"
              progress={100}
              badgeText="Enrolled"
              badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              onClick={() => handleCardClick("students")}
            />

            <AnalystKpiCard
              title="Total Teachers"
              value={(overview?.teacherCount || 0).toLocaleString()}
              subtitle={`1 Teacher per ${
                overview?.teacherCount
                  ? Math.round((overview?.studentCount || 0) / overview.teacherCount)
                  : 0
              } Students`}
              icon={GraduationCap}
              colorScheme="indigo"
              progress={100}
              badgeText="Active"
              badgeColor="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              onClick={() => handleCardClick("teachers")}
            />

            <AnalystKpiCard
              title="Today's Classes"
              value={overview?.todaySessionsCount !== undefined ? overview.todaySessionsCount : overview?.activeClassesToday || 0}
              subtitle={`${overview?.todayStats?.present || 0} Present • in ${overview?.activeClassesToday || 0}/${overview?.classCount || 0} Classes`}
              icon={CalendarDays}
              colorScheme="amber"
              progress={
                overview?.classCount
                  ? Math.round(((overview?.activeClassesToday || 0) / overview.classCount) * 100)
                  : 0
              }
              badgeText={
                overview?.todayStats?.total > 0
                  ? `${overview?.todayStats?.percent}% Present`
                  : "Pending"
              }
              badgeColor="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              onClick={() => handleCardClick("today-classes")}
            />

            <AnalystKpiCard
              title="Low Attendance (<75%)"
              value={(overview?.atRiskCount || 0).toLocaleString()}
              subtitle="Students below 75% target"
              icon={AlertTriangle}
              colorScheme="rose"
              progress={
                overview?.studentCount
                  ? Math.round(((overview?.atRiskCount || 0) / overview.studentCount) * 100)
                  : 0
              }
              badgeText={
                (overview?.atRiskCount || 0) > 0 ? "Needs Attention" : "All Good"
              }
              badgeColor={
                (overview?.atRiskCount || 0) > 0
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              }
              onClick={() => handleCardClick("at-risk")}
            />
          </div>

          {/* ── Attendance Trends Graph ──────── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Attendance Overview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Daily attendance percentage and student turnout over time
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls: Timeframe & Metric Mode */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {/* Metric toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setMetricMode("percent")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      metricMode === "percent"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setMetricMode("volume")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      metricMode === "volume"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Total Count
                  </button>
                </div>

                {/* Days range buttons */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeframe(days)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        timeframe === days
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Area Chart Container */}
            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="analystGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                    opacity={0.15}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    dy={10}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={metricMode === "percent" ? [0, 100] : ["auto", "auto"]}
                    unit={metricMode === "percent" ? "%" : ""}
                  />
                  <Tooltip content={<CustomTrendTooltip />} />
                  {metricMode === "percent" && (
                    <ReferenceLine
                      y={75}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{
                        value: "75% Target",
                        fill: "#ef4444",
                        fontSize: 10,
                        position: "insideTopRight",
                      }}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey={metricMode === "percent" ? "percent" : "total"}
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#analystGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Summary Cards Below Chart */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Average Attendance
                </span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {trendStats.avg}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Best Day
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {trendStats.peak ? `${trendStats.peak.percent}%` : "—"}
                </span>
                {trendStats.peak && (
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(trendStats.peak.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Lowest Day
                </span>
                <span className="text-base font-extrabold text-rose-500">
                  {trendStats.low ? `${trendStats.low.percent}%` : "—"}
                </span>
                {trendStats.low && (
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(trendStats.low.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Total Records Logged
                </span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                  {trendStats.totalVolume.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Class Attendance & Breakdown Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Class Comparison Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Class Attendance Comparison
                    </h3>
                    <p className="text-xs text-slate-500">
                      Attendance percentage for each class compared to 75% target
                    </p>
                  </div>
                </div>
              </div>

              {classBreakdown.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-xs text-slate-400">
                  No class attendance recorded yet.
                </div>
              ) : (
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={classBreakdown}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        domain={[0, 100]}
                        unit="%"
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <ReferenceLine
                        y={75}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                      <Bar dataKey="rate" radius={[8, 8, 0, 0]} maxBarSize={45}>
                        {classBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.rate >= 75 ? "#10b981" : "#f59e0b"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Right 1 Col: Donut Composition */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <PieChartIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Attendance Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">Total present vs absent records</p>
                  </div>
                </div>

                <div className="h-[180px] w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutData.map((entry, idx) => (
                          <Cell key={`donut-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Stat */}
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {overview?.overallPercent || 0}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Present
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Total Present
                  </span>
                  <strong className="text-slate-900 dark:text-white">
                    {(overview?.presentRecords || 0).toLocaleString()} (
                    {overview?.totalRecords
                      ? Math.round(((overview.presentRecords || 0) / overview.totalRecords) * 100)
                      : 0}
                    %)
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Total Absent
                  </span>
                  <strong className="text-slate-900 dark:text-white">
                    {(overview?.absentRecords || 0).toLocaleString()} (
                    {overview?.totalRecords
                      ? Math.round(((overview.absentRecords || 0) / overview.totalRecords) * 100)
                      : 0}
                    %)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* ── Operational Widgets: Notice Board & Class Routine ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NoticeBoardWidget />
            <TimetableWidget />
          </div>
        </>
      )}

      {/* Leave Approval Modal */}
      <LeaveManagementModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />

      {/* Drill Down Modal */}
      {drillDown.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {drillDown.type === "teachers" && "Teachers List"}
                  {drillDown.type === "students" && "Students List"}
                  {drillDown.type === "today-classes" && "Today's Classes"}
                  {drillDown.type === "overall" && "Overall Attendance Breakdown"}
                  {drillDown.type === "at-risk" && "At-Risk Students (<75%)"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {drillDown.type === "teachers" && "Active teachers in the institution"}
                  {drillDown.type === "students" && "Registered students across all classes"}
                  {drillDown.type === "today-classes" && "Classes with attendance logged today"}
                  {drillDown.type === "overall" && "Top classes by attendance percentage"}
                  {drillDown.type === "at-risk" && "Students requiring immediate attention"}
                </p>
              </div>
              <button
                onClick={() => setDrillDown({ isOpen: false, type: null, loading: false, data: [] })}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
              {drillDown.loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500 mt-3 font-medium">Loading details...</p>
                </div>
              ) : drillDown.data.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                  No records found.
                </div>
              ) : (
                <div className="space-y-3">
                  {drillDown.type === "teachers" &&
                    drillDown.data.map((teacher) => (
                      <div key={teacher._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                            {(teacher.user?.name || teacher.name || "T").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{teacher.user?.name || teacher.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.department?.name || "General Department"}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active
                        </span>
                      </div>
                    ))}

                  {drillDown.type === "students" &&
                    drillDown.data.map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            {(student.user?.name || student.name || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{student.user?.name || student.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {student.class?.name || "N/A"} • {student.rollNo}
                            </p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active
                        </span>
                      </div>
                    ))}

                  {drillDown.type === "today-classes" &&
                    drillDown.data.map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {session.subject?.name} <span className="text-xs text-slate-400 font-normal">({session.class?.name})</span>
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            By {session.teacher?.name} • Session: {session.session}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {session.attendancePercent}%
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {session.presentCount}/{session.totalStudents} Present
                          </p>
                        </div>
                      </div>
                    ))}

                  {drillDown.type === "overall" &&
                    drillDown.data.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Total Records: {c.total}
                          </p>
                        </div>
                        <div className="w-24 text-right">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-500">Attendance</span>
                            <span className="font-bold text-slate-900 dark:text-white">{c.rate}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${c.rate >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(100, Math.max(0, c.rate))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                  {drillDown.type === "at-risk" &&
                    drillDown.data.map((student, idx) => (
                      <div key={student._id || idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-sm">
                            {student.percent}%
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Class: {student.className || "N/A"} • Roll: {student.rollNo}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          {student.present}/{student.total} Classes
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
