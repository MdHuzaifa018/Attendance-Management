import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  BookMarked,
  ClipboardList,
  BarChart3,
  GraduationCap,
  LogOut,
  Menu,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * navItems — sidebar navigation links for the Admin role.
 * Only include pages that are actually built. Phase 6+ pages are listed
 * as comments so they can be uncommented when implemented.
 */
const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/students", label: "Students", icon: Users },
  { path: "/admin/teachers", label: "Teachers", icon: UserCheck },
  { path: "/admin/departments", label: "Departments", icon: Building2 },
  { path: "/admin/classes", label: "Classes", icon: BookOpen },
  { path: "/admin/subjects", label: "Subjects", icon: BookMarked },
  { path: "/admin/attendance", label: "Attendance", icon: ClipboardList },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
];

/**
 * AdminLayout
 *
 * Shell component for all /admin/* pages.
 * Renders: left sidebar + topbar + <Outlet /> for page content.
 *
 * Responsive:
 *   - Desktop (lg+): sidebar always visible, static (takes space in flow).
 *   - Mobile (<lg): sidebar hidden, shown as an overlay when hamburger is clicked.
 *
 * Usage in App.jsx:
 *   <Route element={<AdminLayout />}>
 *     <Route path="/admin/dashboard" element={<AdminDashboard />} />
 *   </Route>
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  // Build initials for the avatar circle (max 2 letters)
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Mobile overlay ────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800
          flex flex-col z-30 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">Nalanda College</p>
            <p className="text-slate-500 text-xs">Attendance System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="text-slate-600 text-[11px] font-semibold uppercase tracking-widest px-5 mb-2">
            Administration
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "text-indigo-300 bg-indigo-600/15 border-r-2 border-indigo-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            id="admin-layout-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400
              hover:bg-red-500/10 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            id="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User badge — desktop */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-slate-300 text-sm font-medium">
              {user?.name}
            </span>
            <span className="text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Page content — individual pages render here via <Outlet /> */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
