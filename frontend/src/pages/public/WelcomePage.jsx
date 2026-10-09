import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Landmark,
  Laptop,
  Quote,
  IdCard,
  FileSpreadsheet,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";

/**
 * Animated Digit Counter Component
 * Triggers counting animation as soon as element enters the viewport.
 */
const AnimatedDigitCounter = ({ target, suffix = "", prefix = "", duration = 1800, formatComma = true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // smooth ease-out-expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, target, duration]);

  const displayCount = formatComma && count >= 1000 ? count.toLocaleString() : count;

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {displayCount}
      {suffix}
    </span>
  );
};

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { logo, settings } = useCollegeSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  // Reusable Smooth Motion Variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const cardHoverEffect = {
    hover: {
      y: -6,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans-modern transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP NAVIGATION BAR (100% RESPONSIVE)                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 p-1 border-2 border-indigo-500/25 shadow-md flex items-center justify-center overflow-hidden shrink-0"
            >
              <img
                src={logo || "/images/college-logo.png"}
                alt="Nalanda College Crest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-slate-950 dark:text-white tracking-tight text-sm sm:text-lg leading-tight uppercase font-heading truncate">
                  {settings?.collegeName || "Nalanda College"}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300/50 shrink-0">
                  Estd. 1870
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[180px] sm:max-w-xs md:max-w-none">
                Constituent Unit of Patliputra Univ. • Bihar Sharif
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with animated hover line */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#college-overview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative py-1 group">
              <span>College Overview</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#principal-desk" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative py-1 group">
              <span>Principal's Desk</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#coordinators" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative py-1 group">
              <span>Coordinators</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <Link to="/portal" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-extrabold group">
              <span>Smart ERP Portal</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />

            {/* Desktop Dashboard / Sign In */}
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(getDashboardPath())}
                className="hidden sm:flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary Access ERP Button (Interactive Pulse & Scale) */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                to="/portal"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_4px_14px_rgba(255,184,0,0.35)] transition-all cursor-pointer uppercase tracking-wider shrink-0"
              >
                <span>Access ERP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-5 space-y-3 shadow-xl"
            >
              <div className="flex flex-col space-y-2 text-sm font-bold">
                <a
                  href="#college-overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>🏛️ College Overview</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                </a>
                <a
                  href="#principal-desk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>🎓 Principal's Desk</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                </a>
                <a
                  href="#coordinators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>💻 Coordinators (BCA & MCA)</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                </a>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200"
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-[#FFB800] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md"
                >
                  Launch Smart Campus ERP ➔
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION                                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        
        {/* Ambient Floating Glow Elements */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Prestigious Hero Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariant}
              className="lg:col-span-7 space-y-5 text-left"
            >
              {/* Category Pill with bounce */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
              >
                <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>ESTD. 1870 • 155+ YEARS OF ACADEMIC PRESTIGE</span>
              </motion.div>

              {/* Bold Headline — Original Kapra font */}
              <h1 className="text-slate-950 dark:text-white font-kapra tracking-tight leading-[0.92] text-5xl sm:text-6xl md:text-7xl uppercase">
                NALANDA COLLEGE, <br />
                <span className="text-[#0038ff] dark:text-[#4d77ff]">BIHAR SHARIF.</span>
              </h1>

              {/* Short & Crisp Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                Constituent unit of{" "}
                <span className="bg-[#FFE500] text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  Patliputra University, Patna
                </span>
                . Dedicated to higher academic excellence, modern computer education, and{" "}
                <span className="bg-[#FFE500] text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  Smart Campus ERP
                </span>{" "}
                attendance governance.
              </p>

              {/* 4 Clean Mini Badges with Hover Micro-Animations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-xl">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Estd. 1870</div>
                  <div className="text-[10px] text-slate-500">155+ Years</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Patliputra Univ.</div>
                  <div className="text-[10px] text-slate-500">Constituent Unit</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">BCA & MCA</div>
                  <div className="text-[10px] text-slate-500">IT Department</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">75% Target</div>
                  <div className="text-[10px] text-slate-500">Live ERP Tracking</div>
                </motion.div>
              </div>

              {/* Action Buttons with magnetic spring */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/portal"
                    className="px-8 py-3.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_8px_24px_rgba(255,184,0,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                  >
                    <span>ACCESS ERP PORTAL</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </motion.div>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#college-overview"
                  className="px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <span>OVERVIEW</span>
                  <ChevronDown className="w-4 h-4 text-indigo-500 animate-bounce" />
                </motion.a>
              </div>
            </motion.div>

            {/* Right Column: Campus Photo Frame with Subtle Floating Motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-[2.2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500 p-1.5 shadow-2xl group">
                <div className="rounded-[2rem] overflow-hidden bg-slate-900 relative aspect-[4/3]">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6 }}
                    src="https://iili.io/nzGbi79.md.jpg"
                    alt="Nalanda College Historic Campus"
                    className="w-full h-full object-cover transform duration-700"
                    onError={(e) => {
                      e.target.src = "/images/hero-students.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Overlaid location badge with bounce */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-3.5 right-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-slate-900 dark:text-white text-[11px] font-black shadow-lg flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>Bihar Sharif, Nalanda</span>
                  </motion.div>

                  <div className="absolute bottom-4 left-4 right-4 text-white text-left pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      CAMPUS OVERVIEW
                    </span>
                    <h3 className="font-heading font-black text-xl uppercase tracking-tight text-white leading-tight">
                      Nalanda College Campus
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Garhpar, Naisarai, Bihar Sharif • Pin 803101
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. SECTION 1: COLLEGE OVERVIEW (WITH ANIMATED DIGIT COUNTERS)       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="college-overview" className="py-16 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
              <Landmark className="w-3.5 h-3.5" />
              <span>COLLEGE OVERVIEW</span>
            </div>
            {/* Same Font Style (Kapra) - Unicode-range prevents DEMO watermark */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              155+ Years of Academic Heritage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Founded in 1870, Nalanda College is a premier institution under Patliputra University, 
              providing quality education across Science, Arts, and Computer Applications.
            </p>
          </motion.div>

          {/* 4 Feature Cards with Staggered Scroll-In */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerStagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                Historic Heritage (1870)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Over 155 years of educational commitment in Bihar Sharif.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                Patliputra Univ. Unit
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recognized constituent college offering UG, PG & vocational courses.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                BCA & MCA Programs
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Department of Computer Applications with dedicated coding labs.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                Smart ERP Platform
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live attendance engine, digital student profiles, and class routines.
              </p>
            </motion.div>
          </motion.div>

          {/* 🔢 LIVE ANIMATED DIGIT STATS STRIP (Counts up smoothly when scrolled) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              
              {/* Stat 1: 1870 Foundation Year */}
              <div className="pt-2 md:pt-0 space-y-0.5">
                <div className="text-3xl sm:text-4xl font-kapra text-indigo-600 dark:text-indigo-400 tracking-tight">
                  <AnimatedDigitCounter target={1870} duration={1600} formatComma={false} />
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Estd. Year
                </div>
              </div>

              {/* Stat 2: 25+ Departments */}
              <div className="pt-2 md:pt-0 space-y-0.5">
                <div className="text-3xl sm:text-4xl font-kapra text-amber-500 tracking-tight">
                  <AnimatedDigitCounter target={25} suffix="+" duration={1400} />
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Departments
                </div>
              </div>

              {/* Stat 3: 5,000+ Students */}
              <div className="pt-2 md:pt-0 space-y-0.5">
                <div className="text-3xl sm:text-4xl font-kapra text-blue-600 dark:text-blue-400 tracking-tight">
                  <AnimatedDigitCounter target={5000} suffix="+" duration={1800} />
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Students
                </div>
              </div>

              {/* Stat 4: 75% Attendance Mandate */}
              <div className="pt-2 md:pt-0 space-y-0.5">
                <div className="text-3xl sm:text-4xl font-kapra text-emerald-600 dark:text-emerald-400 tracking-tight">
                  <AnimatedDigitCounter target={75} suffix="%" duration={1500} />
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Attendance Mandate
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. SECTION 2: PRINCIPAL'S DESK                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="principal-desk" className="py-16 lg:py-20 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            className="space-y-1.5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
              <Landmark className="w-3.5 h-3.5" />
              <span>OFFICE OF THE PRINCIPAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              Principal's Desk
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
            className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-52 h-64 sm:w-56 sm:h-70 rounded-2xl overflow-hidden bg-slate-900 shadow-xl border-2 border-indigo-500/30 group"
                >
                  <img
                    src="https://iili.io/nGr9Vj9.md.jpg"
                    alt="Prof. Dr. Sunita Sinha, Principal"
                    className="w-full h-full object-cover object-[center_15%] transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/images/hero-students.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-center shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Principal • Nalanda College
                    </span>
                  </div>
                </motion.div>

                <div className="space-y-0.5">
                  <h3 className="font-kapra uppercase text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                    Prof. Dr. Sunita Sinha
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Principal, Nalanda College
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Constituent Unit of Patliputra University, Patna
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4 text-left">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70 relative shadow-xs"
                >
                  <Quote className="w-6 h-6 text-indigo-500/30 absolute top-3 right-3 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                    “At Nalanda College, we strive to nurture knowledge, integrity, and innovation. Our commitment is to empower every student through academic excellence, transparent governance, and technology-driven education.”
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">75% Attendance</h5>
                    <p className="text-[11px] text-slate-500">Strict university mandate</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">ERP Digitization</h5>
                    <p className="text-[11px] text-slate-500">Live lecture & class logs</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Academic Rigor</h5>
                    <p className="text-[11px] text-slate-500">Excellence in all streams</p>
                  </motion.div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Office of The Principal
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Nalanda College, Bihar Sharif
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. SECTION 3: DEPARTMENT COORDINATORS                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="coordinators" className="py-16 lg:py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header with smooth entrance */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
            className="text-center max-w-2xl mx-auto space-y-1.5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-800/60">
              <Laptop className="w-3.5 h-3.5" />
              <span>DEPARTMENT OF COMPUTER APPLICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              Department Coordinators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Academic leadership guiding the BCA & MCA vocational programs at Nalanda College.
            </p>
          </motion.div>

          {/* 2 Coordinator Cards with Interactive Hover and Centered Portraits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerStagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto"
          >
            
            {/* Card 1: BCA Coordinator (Dr. Sharifuddin Gazi) */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5 text-center">
                
                {/* Centered Dignified Portrait */}
                <div className="relative w-52 h-64 sm:w-60 sm:h-72 mx-auto rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-500/40 shadow-md group">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    src="https://iili.io/nGr9l24.md.jpg"
                    alt="Dr. Sharifuddin Gazi, BCA Coordinator"
                    className="w-full h-full object-cover object-[center_20%] transform"
                    onError={(e) => {
                      e.target.src = "/images/hero-students.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider py-1 rounded-lg shadow-md">
                    BCA Coordinator
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-1">
                  <h3 className="font-kapra uppercase text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                    Dr. Sharifuddin Gazi
                  </h3>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    Coordinator & HOD, Computer Applications (BCA)
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nalanda College, Bihar Sharif
                  </p>
                </div>

                {/* Clean Quote */}
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/70 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed text-left">
                  <Quote className="w-4 h-4 text-amber-500 mb-1 inline mr-1 opacity-70" />
                  “Empowering future IT professionals through strong programming fundamentals, practical learning, and academic excellence while fostering discipline, innovation, and career readiness.”
                </div>

              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Bachelor of Computer Applications</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">BCA Program</span>
              </div>
            </motion.div>

            {/* Card 2: MCA Coordinator (Dr. Shashank Shekhar Jha) */}
            <motion.div
              variants={fadeUpVariant}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5 text-center">
                
                {/* Centered Dignified Portrait */}
                <div className="relative w-52 h-64 sm:w-60 sm:h-72 mx-auto rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 shadow-md group">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    src="https://iili.io/nGr9bjt.md.jpg"
                    alt="Dr. Shashank Shekhar Jha"
                    className="w-full h-full object-cover object-[center_20%] transform"
                    onError={(e) => {
                      e.target.src = "/images/hero-students.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider py-1 rounded-lg shadow-md">
                    MCA Coordinator
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-1">
                  <h3 className="font-kapra uppercase text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                    Dr. Shashank Shekhar Jha
                  </h3>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    Coordinator, MCA Program
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nalanda College, Bihar Sharif
                  </p>
                </div>

                {/* Clean Quote */}
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/70 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed text-left">
                  <Quote className="w-4 h-4 text-indigo-500 mb-1 inline mr-1 opacity-70" />
                  “Guiding aspiring technology leaders through advanced computing, emerging technologies, and research-driven learning while nurturing innovation and professional growth.”
                </div>

              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Master of Computer Applications</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">MCA Program</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. SECTION 4: SMART CAMPUS ERP GATEWAY                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="erp-gateway" className="py-16 lg:py-20 relative scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white border-2 border-indigo-700/50 shadow-2xl overflow-hidden text-center group"
          >
            {/* Animated internal glowing orbs */}
            <motion.div
              animate={{ x: [0, 30, 0], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -30, 0], opacity: [0.12, 0.25, 0.12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
            />
            
            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>OFFICIAL DIGITAL ATTENDANCE & ACADEMIC GATEWAY</span>
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-white leading-[0.92]">
                  Enter The Smart Campus ERP Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Real-time attendance tracking, 75% university eligibility monitor, 
                  smart digital student ID cards, and semester class timetables.
                </p>
              </div>

              {/* 4 Feature Chips with Hover Shift */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-2xl mx-auto pt-1">
                <motion.div
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">75% Target Engine</div>
                  <div className="text-[10px] text-slate-400">Automated alerts</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-colors"
                >
                  <IdCard className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="text-xs font-bold text-white">Digital ID Card</div>
                  <div className="text-[10px] text-slate-400">Student Profile</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-colors"
                >
                  <CalendarDays className="w-4 h-4 text-indigo-400 mb-1" />
                  <div className="text-xs font-bold text-white">Class Timetable</div>
                  <div className="text-[10px] text-slate-400">Semester routines</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-400 mb-1" />
                  <div className="text-xs font-bold text-white">Faculty Register</div>
                  <div className="text-[10px] text-slate-400">Daily lecture logs</div>
                </motion.div>
              </div>

              {/* Main Action Buttons with Spring Feedback */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    to="/portal"
                    className="w-full sm:w-auto px-8 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_10px_28px_rgba(255,184,0,0.4)] hover:shadow-[0_14px_36px_rgba(255,184,0,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                  >
                    <span>ACCESS SMART CAMPUS ERP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white border-2 border-white/20 hover:border-white/40 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                  >
                    <span>PORTAL LOGIN</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </Link>
                </motion.div>
              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. CLEAN FOOTER                                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center">
                <img
                  src={logo || "/images/college-logo.png"}
                  alt="Nalanda College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white uppercase text-xs sm:text-sm">
                  {settings?.collegeName || "Nalanda College, Bihar Sharif"}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Constituent Unit of Patliputra University, Patna • Estd. 1870
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 font-semibold text-slate-300 text-xs">
              <a href="#college-overview" className="hover:text-white transition-colors">Overview</a>
              <a href="#principal-desk" className="hover:text-white transition-colors">Principal</a>
              <a href="#coordinators" className="hover:text-white transition-colors">Coordinators</a>
              <Link to="/portal" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Access ERP</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} Nalanda College, Bihar Sharif. All rights reserved.
            </div>
            <div className="text-slate-400">
              Department of Computer Applications (BCA & MCA)
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default WelcomePage;
