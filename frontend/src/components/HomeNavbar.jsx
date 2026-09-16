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
      className={`fixed top-0 left-0 right-0 w-full max-w-[100vw] z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md py-2.5 shadow-md border-b border-slate-200/80 dark:border-slate-800/80"
          : "bg-transparent py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt="Nalanda College Emblem"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-display font-black text-sm sm:text-lg lg:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                NALANDA
              </span>
              <span className="font-display font-black text-sm sm:text-lg lg:text-xl tracking-tight text-indigo-600 dark:text-indigo-400 leading-none">
                ERP
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
              College Attendance
            </p>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links (Clean, Uncluttered, Breathable) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer font-poppins"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <>
              {/* Login Button (Visible on Desktop lg+) */}
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-slate-900 dark:hover:border-slate-400 text-slate-900 dark:text-white text-xs font-black tracking-wide transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </Link>

              {/* Primary High-Impact CTA Button (Visible on Desktop lg+) */}
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-amber-400/25 transition-all border border-amber-500/30 cursor-pointer"
              >
                <span>ACCESS PORTAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile Minimalist Menu Toggle (Visible on < lg) */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md"
                >
                  Student Registration ⚡
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeNavbar;
