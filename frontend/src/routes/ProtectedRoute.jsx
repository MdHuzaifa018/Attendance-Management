import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires the user to be authenticated.
 * If authentication is still loading (app just started, /me call in flight)
 * show a full-screen spinner so we don't flash the login page.
 * If loading is done and there is no user → redirect to /login.
 * Passes the current location as state so LoginPage can redirect back after login.
 * If the user is authenticated → render the child route via <Outlet />.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a simple full-screen loader while the /me check runs on page refresh
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated → send to login, preserve the attempted URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
