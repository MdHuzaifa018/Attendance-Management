import { ShieldOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";

/**
 * UnauthorizedPage
 * Shown when a logged-in user tries to access a route their role doesn't allow.
 */
const UnauthorizedPage = () => {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "teacher"
      ? "/teacher/dashboard"
      : user?.role === "student"
      ? "/student/dashboard"
      : "/login";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
          You don't have permission to view this page. Please contact your
          administrator if you think this is a mistake.
        </p>
        <Link
          to={dashboardPath}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to your dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
