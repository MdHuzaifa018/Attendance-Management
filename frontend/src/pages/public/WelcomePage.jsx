import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  BookOpen,
  MapPin,
  ExternalLink,
  ChevronRight,
  Landmark,
  Compass,
  Laptop,
  Quote,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { logo, settings } = useCollegeSettings();

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-poppins transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* ── 1. Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & College Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 p-1 border-2 border-indigo-500/20 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img
                src={logo || "/images/college-logo.png"}
                alt="Nalanda College Crest"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-950 dark:text-white tracking-tight text-base sm:text-lg leading-tight uppercase font-heading">
                  {settings?.collegeName || "Nalanda College"}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300/50">
                  Estd. 1870
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[220px] sm:max-w-none">
                Constituent Unit of Patliputra University, Patna • Bihar Sharif
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchor Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#college-overview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              College Overview
            </a>
            <a href="#leadership" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Principal's Desk
            </a>
            <a href="#coordinator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              BCA Coordinator
            </a>
            <Link
              to="/portal"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Smart Campus ERP</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/portal"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_6px_20px_rgba(255,184,0,0.35)] transition-all cursor-pointer uppercase tracking-wider"
                >
                  <span>Access ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section: College Heritage & Overview ─────────────────── */}
      <section id="college-overview" className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Prestigious Text & Overview */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Category Pill — Same Theme Marker as Screenshot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>ESTD. 1870 • 155+ YEARS OF ACADEMIC PRESTIGE</span>
              </div>

              {/* Bold Headline — Matching Hero Typography */}
              <h1 className="text-slate-950 dark:text-white font-kapra tracking-tight leading-[0.92] text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] uppercase">
                NALANDA COLLEGE, <br />
                <span className="text-[#0038ff] dark:text-[#4d77ff]">BIHAR SHARIF.</span>
              </h1>

              {/* Overview Subtitle with Highlighters */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                A premier constituent unit of{" "}
                <span className="bg-[#FFE500] dark:bg-[#FFE500] text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  Patliputra University, Patna
                </span>
                , carrying forward the glorious legacy of ancient Nalanda with cutting-edge academic excellence, dedicated faculty, and modern{" "}
                <span className="bg-[#FFE500] dark:bg-[#FFE500] text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  smart campus digitization
                </span>
                .
              </p>

              {/* Four Clean Academic Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Estd. 1870</h4>
                    <p className="text-[11px] text-slate-500">Historic Institution</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Patliputra Univ.</h4>
                    <p className="text-[11px] text-slate-500">Constituent Unit</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Dept. of BCA/MCA</h4>
                    <p className="text-[11px] text-slate-500">Computer Applications</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Smart ERP</h4>
                    <p className="text-[11px] text-slate-500">Live Attendance</p>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <Link
                  to="/portal"
                  className="px-8 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_8px_24px_rgba(255,184,0,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                >
                  <span>ACCESS ERP PORTAL</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
                >
                  <span>PORTAL LOGIN</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Campus Showcase Frame */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:col-span-5 relative"
            >
              {/* Outer Decorative Border — Same aesthetic as Screenshot frame */}
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500 p-1.5 shadow-2xl">
                <div className="rounded-[2.3rem] overflow-hidden bg-slate-900 relative aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="/images/college-campus.jpg"
                    alt="Nalanda College Historic Campus"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "/images/hero-students.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                  {/* Overlaid Pill Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-slate-900 dark:text-white text-xs font-black shadow-lg flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Bihar Sharif, Nalanda</span>
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-5 left-5 right-5 text-white text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      CAMPUS OVERVIEW
                    </span>
                    <h3 className="font-kapra text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
                      Nalanda College Campus
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      Garhpar, Naisarai, Bihar Sharif • Pin 803101
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3. Leadership & Academic Mentorship Section ──────────────────── */}
      <section id="leadership" className="py-16 lg:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
              <Award className="w-3.5 h-3.5" />
              <span>COLLEGE LEADERSHIP & MENTORSHIP</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              Guiding The Path of Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Honoring the visionary leadership of our Principal and Academic Coordinator who inspire
              and drive our college's academic rigor and digital transformation.
            </p>
          </div>

          {/* Leadership Cards Grid: Principal Mam & Coordinator Sir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            
            {/* ── Card 1: Principal Mam (Prof. Dr. Sunita Sinha) ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700" />

              <div className="space-y-6">
                {/* Photo and Badge */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 ring-4 ring-indigo-500/20 shadow-lg bg-slate-100 dark:bg-slate-800">
                    <img
                      src="/images/principal.jpg"
                      alt="Prof. (Dr.) Sunita Sinha, Principal"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/images/hero-students.jpg";
                      }}
                    />
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      <Landmark className="w-3 h-3" />
                      <span>Principal's Desk</span>
                    </div>
                    <h3 className="font-kapra text-2xl sm:text-3xl uppercase tracking-tight text-slate-950 dark:text-white leading-tight pt-1">
                      Prof. (Dr.) Sunita Sinha
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Principal, Nalanda College
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Constituent Unit of Patliputra University, Patna
                    </p>
                  </div>
                </div>

                {/* Inspiring Quote / Message */}
                <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  <Quote className="w-4 h-4 text-indigo-500 mb-1 shrink-0 opacity-70" />
                  "Nalanda College carries a 155-year heritage of intellectual pursuit. We are
                  dedicated to modernizing academic administration through digital systems like
                  Smart Campus ERP, ensuring complete attendance transparency and student empowerment."
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Office of the Principal</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Nalanda College</span>
              </div>
            </motion.div>

            {/* ── Card 2: Academic Coordinator (Prof. Md Alauddin Khan) ── */}
            <motion.div
              id="coordinator"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              <div className="space-y-6">
                {/* Photo and Badge */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 ring-4 ring-amber-500/20 shadow-lg bg-slate-100 dark:bg-slate-800">
                    <img
                      src="/images/director.webp"
                      alt="Prof. Md Alauddin Khan, Coordinator & HOD"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/images/hero-students.jpg";
                      }}
                    />
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Laptop className="w-3 h-3" />
                      <span>Academic Coordinator</span>
                    </div>
                    <h3 className="font-kapra text-2xl sm:text-3xl uppercase tracking-tight text-slate-950 dark:text-white leading-tight pt-1">
                      Prof. Md Alauddin Khan
                    </h3>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Coordinator & HOD, Computer Applications (BCA)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Department of Computer Applications • Nalanda College
                    </p>
                  </div>
                </div>

                {/* Inspiring Quote / Message */}
                <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  <Quote className="w-4 h-4 text-amber-500 mb-1 shrink-0 opacity-70" />
                  "Our Department of Computer Applications is committed to high-standard technical
                  education. The Smart Campus ERP portal provides live lecture tracking, 75% university rule
                  monitoring, and seamless digital access to every student."
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Dept. of Computer Applications</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">BCA Program</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 4. Prominent Portal Gateway Banner (The Transition Button) ───── */}
      <section className="py-16 lg:py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white border-2 border-indigo-700/40 shadow-2xl overflow-hidden text-center">
            
            {/* Glow effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL DIGITAL ATTENDANCE & ACADEMIC GATEWAY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-white leading-tight">
                Enter The Smart Campus Portal
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Seamless real-time attendance tracking, automated university 75% compliance engine,
                smart digital ID cards with barcodes, and semester routines.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/portal"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_8px_30px_rgba(255,184,0,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                >
                  <span>LAUNCH SMART CAMPUS ERP</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
                >
                  <span>STUDENT & STAFF SIGN IN</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Clean Minimal Institutional Footer ────────────────────────── */}
      <footer className="py-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-semibold text-slate-700 dark:text-slate-300">
            <Link to="/portal" className="hover:text-indigo-600 transition-colors">
              Smart Campus ERP
            </Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">
              Portal Sign In
            </Link>
            <Link to="/register" className="hover:text-indigo-600 transition-colors">
              Student Admission Registration
            </Link>
            <a href="#leadership" className="hover:text-indigo-600 transition-colors">
              Leadership
            </a>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-4xl mx-auto">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Nalanda College, Bihar Sharif (Patliputra University). All Rights Reserved.
            </p>
            <p className="text-slate-400 dark:text-slate-500 font-medium">
              Smart Campus ERP v1.0 • Developed by{" "}
              <a
                href="https://latest-portfolio-huzaif-sheikh.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Md Huzaifa
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default WelcomePage;
