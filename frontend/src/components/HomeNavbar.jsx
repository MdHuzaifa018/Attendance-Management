import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  CalendarDays,
  Bell,
  LogIn,
  LayoutDashboard,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./common/ThemeToggle.jsx";

const HomeNavbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  const navLinks = [
    { label: "Campus & Gallery", href: "#campus-gallery" },
    { label: "Routine", href: "#timetable" },
    { label: "Portals", href: "#portals" },
    { label: "Mentorship", href: "#mentorship" },
    { label: "Developer", href: "#developer" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/40 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <img
            src="/logo.png"
            alt="Nalanda College Emblem"
            className="w-10 h-10 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
          />
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                NALANDA
              </span>
              <span className="font-display font-black text-xl tracking-tight text-indigo-600 dark:text-indigo-400 leading-none">
                ERP
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mt-0.5">
              Smart Campus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/5 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-900/5 dark:border-white/5 backdrop-blur-md">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all duration-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 group overflow-hidden"
            >
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>

              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/10 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Access Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden relative z-50 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-x-4 top-20 p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-500 transform origin-top ${
          mobileMenuOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors flex items-center justify-between group"
            >
              {item.label}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
            </a>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(getDashboardPath());
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-transform"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl text-sm font-bold active:scale-[0.98] transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Portal
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-bold shadow-lg active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                Student Registration
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
