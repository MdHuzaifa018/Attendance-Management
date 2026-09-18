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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: "radial-gradient(circle at 50% 30%, #0f172a 0%, #020617 100%)", fontFamily: "'Outfit', sans-serif" }}>
        
        {/* Ambient background aura (from index.html) */}
        <div style={{ position: "absolute", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", borderRadius: "50%", animation: "pulseAura 4s ease-in-out infinite alternate" }}></div>

        {/* Glass Card */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "32px", padding: "42px 36px", maxWidth: "420px", width: "100%", boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(99, 102, 241, 0.2)", textAlign: "center" }}>
          
          {/* Logo Container with Glowing Halo */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <div style={{ position: "absolute", inset: "-8px", background: "linear-gradient(135deg, rgba(0, 56, 255, 0.4), rgba(245, 158, 11, 0.3))", borderRadius: "28px", filter: "blur(12px)", animation: "pulseLogo 3s ease-in-out infinite alternate" }}></div>
            <img src="/logo.png" alt="Nalanda College ERP" style={{ position: "relative", zIndex: 2, width: "88px", height: "88px", objectFit: "contain", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }} />
          </div>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "0.5px", color: "#ffffff" }}>NALANDA</span>
            <span style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "0.5px", color: "#6366f1" }}>ERP</span>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 24px 0" }}>
            Patliputra University Unit
          </p>

          {/* Elegant Liquid Progress Bar */}
          <div style={{ width: "100%", maxWidth: "260px", height: "5px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "9999px", overflow: "hidden", position: "relative", marginBottom: "16px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "50%", background: "linear-gradient(90deg, #0038ff, #6366f1, #fbbf24)", borderRadius: "9999px", animation: "liquidProgress 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite" }}></div>
          </div>

          {/* Status Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600, color: "#cbd5e1", letterSpacing: "0.8px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "blinkStatus 1.2s infinite ease-in-out" }}></span>
            <span>Establishing Secure Connection...</span>
          </div>
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
