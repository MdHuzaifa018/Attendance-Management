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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Welcome back, {user?.name}. Your academic attendance overview is below.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-violet-50 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/30 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm">Student Portal Active</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Welcome to your student dashboard. Here you can check your overall attendance percentage,
          subject-wise lecture attendance, and exam eligibility status.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Authenticated User
        </p>
        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p><span className="text-slate-400 dark:text-slate-500">name: </span>{user?.name}</p>
          <p><span className="text-slate-400 dark:text-slate-500">email: </span>{user?.email}</p>
          <p><span className="text-slate-400 dark:text-slate-500">role: </span>{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
