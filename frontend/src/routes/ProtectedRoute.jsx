import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If initial auth verification is still running
  if (loading) {
    return null;
  }

  // Not authenticated → send to login, preserve the attempted URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render nested routes immediately
  return <Outlet />;
};

export default ProtectedRoute;
