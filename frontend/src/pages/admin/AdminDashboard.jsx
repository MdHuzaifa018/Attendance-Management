import { useAuth } from "../../context/AuthContext.jsx";
import { LayoutDashboard } from "lucide-react";

/**
 * AdminDashboard — Phase 5 placeholder.
 * The AdminLayout shell handles sidebar, topbar, and logout.
 * This component only renders the page content area.
 *
 * Phase 6: Replace this with real stat cards, charts (Recharts),
 * and analytics data from GET /api/reports/overview.
 */
const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Page heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Welcome back, {user?.name}. Here's your system overview.
        </p>
      </div>

      {/* Phase 5 placeholder card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Phase 5 Complete</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Authentication, routing, layouts, and auth guards are all working.
          Full dashboard analytics (stat cards, attendance charts, low-attendance alerts)
          will be implemented in Phase 6.
        </p>
      </div>

      {/* Current user debug card — remove in Phase 6 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
          Authenticated User
        </p>
        <div className="font-mono text-xs text-slate-300 space-y-1">
          <p><span className="text-slate-500">name: </span>{user?.name}</p>
          <p><span className="text-slate-500">email: </span>{user?.email}</p>
          <p><span className="text-slate-500">role: </span>{user?.role}</p>
          <p><span className="text-slate-500">isActive: </span>{String(user?.isActive)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
