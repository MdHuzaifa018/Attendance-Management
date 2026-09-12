import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * RoleRoute
 *
 * Wraps routes that require a specific user role.
 * Must be nested inside ProtectedRoute (so user is guaranteed non-null here).
 *
 * Props:
 *   allowedRoles  Array of role strings, e.g. ["admin"] or ["admin", "teacher"]
 *
 * If the user's role is not in allowedRoles → redirect to /unauthorized.
 * If the role matches → render child routes via <Outlet />.
 *
 * Important: This is a frontend navigation guard only.
 * Real authorization enforcement lives in the backend protect + authorize middleware.
 * Never treat this as a security boundary.
 *
 * Usage in App.jsx:
 *   <Route element={<RoleRoute allowedRoles={["admin"]} />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 */
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
