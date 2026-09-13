import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
  CalendarDays,
  FileCheck,
} from "lucide-react";
import NoticeBoardWidget from "../../components/NoticeBoardWidget.jsx";
import LeaveManagementModal from "../../components/LeaveManagementModal.jsx";
import TimetableWidget from "../../components/TimetableWidget.jsx";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { getSystemOverview, getAttendanceTrends } from "../../services/reportService.js";

// Helper component for small metric cards
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass} ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
        {value}
      </h3>
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, trendsRes] = await Promise.all([
          getSystemOverview(),
          getAttendanceTrends(7)
        ]);
        setOverview(overviewRes);
        setTrends(trendsRes);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
            Attendance: {payload[0].value}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Total records: {payload[0].payload.total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Admin Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back, {user?.name}. Here's the system overview for today.
          </p>
        </div>

        <button
          onClick={() => setShowLeaveModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileCheck className="w-4 h-4" /> Review Student Leaves
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overall Attendance"
              value={`${overview?.overallPercent || 0}%`}
              icon={Activity}
              colorClass="text-violet-600 dark:text-violet-400"
              bgClass="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50"
              subtitle="System-wide average"
            />
            <StatCard
              title="Total Students"
              value={overview?.studentCount || 0}
              icon={Users}
              colorClass="text-emerald-600 dark:text-emerald-400"
              bgClass="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50"
              subtitle="Active enrollments"
            />
            <StatCard
              title="Faculty Members"
              value={overview?.teacherCount || 0}
              icon={GraduationCap}
              colorClass="text-indigo-600 dark:text-indigo-400"
              bgClass="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50"
              subtitle="Registered teachers"
            />
            <StatCard
              title="Classes Today"
              value={overview?.activeClassesToday || 0}
              icon={CalendarDays}
              colorClass="text-amber-600 dark:text-amber-400"
              bgClass="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50"
              subtitle="Sessions conducted"
            />
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-500" />
                  Attendance Trends
                </h3>
                <p className="text-xs text-slate-500 mt-1">Daily percentage for the last 7 days</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="percent" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPercent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Notice Board & Timetable Grid (Phase 7 & 8) ── */}
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
    </div>
  );
};

export default AdminDashboard;
