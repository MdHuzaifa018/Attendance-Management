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
  History,
  BarChart3,
  GraduationCap,
  LogOut,
  Menu,
} from "lucide-react";

import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/students", label: "Students", icon: Users },
  { path: "/admin/teachers", label: "Teachers", icon: UserCheck },
  { path: "/admin/departments", label: "Departments", icon: Building2 },
  { path: "/admin/classes", label: "Classes", icon: BookOpen },
  { path: "/admin/subjects", label: "Subjects", icon: BookMarked },
  { path: "/admin/attendance", label: "Attendance", icon: ClipboardList },
  { path: "/admin/history", label: "History & Audit", icon: History },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          flex flex-col z-30 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <img
            src="/logo.png"
            alt="Nalanda College ERP Logo"
            className="w-9 h-9 rounded-xl object-contain bg-white/95 p-0.5 shadow-sm border border-indigo-500/20"
          />
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight truncate">
              Nalanda College
            </p>
            <p className="text-slate-500 text-xs">Attendance System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-widest px-5 mb-2">
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
                    ? "text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-600/15 border-r-2 border-indigo-600 dark:border-indigo-500 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User profile info & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                {user?.name}
              </p>
              <p className="text-slate-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            id="admin-layout-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
              Developed by
            </p>
            <a href="https://latest-portfolio-huzaif-sheikh.vercel.app/" target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline">
              Md Huzaifa
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0 transition-colors">
          {/* Mobile hamburger */}
          <button
            id="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Right actions: ThemeToggle + User info */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-slate-800 dark:text-slate-200 text-sm font-semibold">
                {user?.name}
              </span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-0.5 rounded-full font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
