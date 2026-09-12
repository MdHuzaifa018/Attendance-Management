import { useAuth } from "../../context/AuthContext.jsx";
import { GraduationCap } from "lucide-react";

/**
 * StudentDashboard — Phase 5 placeholder.
 * StudentLayout handles sidebar, topbar, and logout.
 * Phase 8: Replace with overall percentage, subject cards, attendance trend chart.
 */
const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Welcome back, {user?.name}. Your attendance overview is below.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Phase 5 Complete</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Authentication and layouts are working. Student dashboard (overall attendance,
          subject-wise breakdown, history) will be built in Phase 8.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Authenticated User
        </p>
        <div className="font-mono text-xs text-slate-300 space-y-1">
          <p><span className="text-slate-500">name: </span>{user?.name}</p>
          <p><span className="text-slate-500">email: </span>{user?.email}</p>
          <p><span className="text-slate-500">role: </span>{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
