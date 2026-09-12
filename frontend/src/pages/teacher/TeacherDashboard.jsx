import { useAuth } from "../../context/AuthContext.jsx";
import { BookOpen } from "lucide-react";

/**
 * TeacherDashboard — Phase 5 placeholder.
 * TeacherLayout handles sidebar, topbar, and logout.
 * Phase 7: Replace with assigned classes, today's attendance summary, recent activity.
 */
const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Welcome back, {user?.name}. Manage your classes and attendance below.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-600/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm">Faculty Portal Active</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Authentication and teacher workspaces are set up. You can mark subject attendance,
          view student rosters, and generate attendance logs.
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

export default TeacherDashboard;
