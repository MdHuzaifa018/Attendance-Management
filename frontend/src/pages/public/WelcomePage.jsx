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
  Clock,
  QrCode,
  FileSpreadsheet,
  Check,
  Briefcase,
  Layers,
  ChevronDown,
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
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans-modern transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP NAVIGATION BAR                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 p-1 border-2 border-indigo-500/25 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
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

          {/* Clean Navigation Anchors */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#college-overview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              College Overview
            </a>
            <a href="#principal-desk" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Principal's Desk
            </a>
            <a href="#coordinator-desk" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              BCA Coordinator
            </a>
            <a href="#erp-gateway" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-extrabold">
              <span>Smart ERP Gateway</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
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

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION: Grand Welcome & Campus Overview                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Prestigious Hero Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Category Pill */}
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
                , carrying forward the glorious legacy of ancient Nalanda with cutting-edge academic excellence, distinguished faculty, and modern{" "}
                <span className="bg-[#FFE500] dark:bg-[#FFE500] text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  Smart Campus ERP digitization
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <Link
                  to="/portal"
                  className="px-8 py-4 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_8px_24px_rgba(255,184,0,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                >
                  <span>ACCESS ERP PORTAL</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#college-overview"
                  className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
                >
                  <span>EXPLORE OVERVIEW</span>
                  <ChevronDown className="w-4 h-4 text-indigo-500" />
                </a>
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

                  {/* Overlaid Location Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-slate-900 dark:text-white text-xs font-black shadow-lg flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Bihar Sharif, Nalanda</span>
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-5 left-5 right-5 text-white text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      CAMPUS OVERVIEW
                    </span>
                    <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-white leading-tight">
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

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. SECTION 1: DETAILED COLLEGE OVERVIEW & HERITAGE                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="college-overview" className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
              <Landmark className="w-3.5 h-3.5" />
              <span>INSTITUTIONAL OVERVIEW & HERITAGE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              A Legacy of 155 Years in Higher Learning
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Established in 1870, Nalanda College stands as one of the oldest and most prestigious educational 
              institutions in eastern India, serving as an intellectual landmark under Patliputra University, Patna.
            </p>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                Historic Heritage (1870)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Founded more than a century and a half ago, reviving the scholarly spirit of ancient Nalanda Mahavihara for modern students.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                Patliputra University Unit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Constituent college conducting prestigious Undergraduate and Postgraduate degree programs across Arts, Science & Vocations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                Tech & Computer Science
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Specialized Department of Computer Applications (BCA) with modern computing labs, programming syllabi, and practical workshops.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                Digital Campus ERP
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete digitization of daily attendance, 75% university eligibility enforcement, student barcode ID cards, and semester timetables.
              </p>
            </div>
          </div>

          {/* Institutional Stats Strip */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              <div className="pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl font-kapra text-indigo-600 dark:text-indigo-400">1870</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Foundation Year</div>
                <div className="text-[11px] text-slate-400">155+ Years Legacy</div>
              </div>
              <div className="pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl font-kapra text-amber-500">25+</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Departments</div>
                <div className="text-[11px] text-slate-400">UG, PG & Vocational</div>
              </div>
              <div className="pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl font-kapra text-blue-600 dark:text-blue-400">5,000+</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Total Students</div>
                <div className="text-[11px] text-slate-400">Across All Disciplines</div>
              </div>
              <div className="pt-3 md:pt-0">
                <div className="text-3xl sm:text-4xl font-kapra text-emerald-600 dark:text-emerald-400">75%</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Mandatory Attendance</div>
                <div className="text-[11px] text-slate-400">Monitored via ERP</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. SECTION 2: FROM THE PRINCIPAL'S DESK (DEDICATED SECTION)        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="principal-desk" className="py-20 lg:py-28 bg-white dark:bg-slate-950 scroll-mt-20 relative overflow-hidden">
        
        {/* Subtle accent backdrop */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Sub-heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
              <Landmark className="w-3.5 h-3.5" />
              <span>OFFICE OF THE PRINCIPAL</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              Message From The Principal
            </h2>
          </div>

          {/* Executive Spotlight Card */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Principal Mam's Dignified Portrait & Title */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5">
                <div className="relative group">
                  {/* Decorative glowing gradient ring */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-600 via-blue-500 to-amber-500 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />
                  
                  <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-white/20">
                    <img
                      src="/images/principal.jpg"
                      alt="Prof. (Dr.) Sunita Sinha, Principal"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "/images/hero-students.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Badge on photo */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Principal • Nalanda College
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name & Academic Credentials - Clean Typography (NO font-kapra glitch) */}
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                    Prof. (Dr.) Sunita Sinha
                  </h3>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    Principal, Nalanda College, Bihar Sharif
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Constituent Unit of Patliputra University, Patna
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-full border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Administrative & Academic Leadership</span>
                </div>
              </div>

              {/* Right Column: Full Official Message */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Quote Box */}
                <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 relative">
                  <Quote className="w-8 h-8 text-indigo-500/30 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                    "Nalanda College carries a 155-year heritage of intellectual pursuit. We are
                    dedicated to modernizing academic administration through digital systems like
                    Smart Campus ERP, ensuring complete attendance transparency and student empowerment."
                  </p>
                </div>

                {/* Detailed Letter Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  <p>
                    <strong className="text-slate-900 dark:text-white font-semibold">Dear Students, Faculty Members, and Guardians,</strong>
                  </p>
                  <p>
                    It is an honor to lead Nalanda College, an institution whose roots trace back to 1870. 
                    Our mission has always been to uphold the unmatched scholarly tradition of ancient Nalanda 
                    while equipping today's youth with modern scientific temper, technical capability, and ethical values.
                  </p>
                  <p>
                    With the deployment of the <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Smart Campus ERP System</strong>, 
                    we are transitioning towards a completely digitized, paperless academic environment. 
                    Students can now view their real-time lecture attendance, track their mandatory 75% university eligibility, 
                    and access departmental notices without delays.
                  </p>
                  <p>
                    I urge every student to attend all lectures diligently, take pride in their academic responsibilities, 
                    and utilize these digital resources to achieve their highest potential.
                  </p>
                </div>

                {/* 3 Strategic Directives */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">75% Attendance Mandate</h5>
                    <p className="text-[11px] text-slate-500">Strict Patliputra Univ compliance</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Digital Transparency</h5>
                    <p className="text-[11px] text-slate-500">Live lecture records via ERP</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Student Welfare</h5>
                    <p className="text-[11px] text-slate-500">Continuous mentorship & aid</p>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Prof. (Dr.) Sunita Sinha</span>
                    <p className="text-[11px] text-slate-500">Principal, Nalanda College</p>
                  </div>
                  <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg">
                    Office of Principal
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. SECTION 3: DEPARTMENT OF COMPUTER APPLICATIONS & COORDINATOR   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="coordinator-desk" className="py-20 lg:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70 scroll-mt-20 relative overflow-hidden">
        
        {/* Subtle accent backdrop */}
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-amber-500/5 dark:bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Sub-heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-800/60">
              <Laptop className="w-3.5 h-3.5" />
              <span>DEPARTMENT OF COMPUTER APPLICATIONS (BCA)</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-kapra uppercase tracking-tight text-slate-950 dark:text-white leading-[0.95]">
              Coordinator's Desk & BCA Department
            </h2>
          </div>

          {/* Executive Spotlight Card */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-900/90 dark:via-slate-900 dark:to-amber-950/20 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Full Department & Coordinator Message */}
              <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
                
                {/* Quote Box */}
                <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 relative">
                  <Quote className="w-8 h-8 text-amber-500/30 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                    "Our Department of Computer Applications is committed to high-standard technical
                    education. The Smart Campus ERP portal provides live lecture tracking, 75% university rule
                    monitoring, and seamless digital access to every student."
                  </p>
                </div>

                {/* Detailed Letter Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  <p>
                    <strong className="text-slate-900 dark:text-white font-semibold">Welcome to the Department of Computer Applications,</strong>
                  </p>
                  <p>
                    In an era driven by Software Engineering, Artificial Intelligence, and Cloud Computing, 
                    the Bachelor of Computer Applications (BCA) program at Nalanda College is designed to bridge 
                    the gap between foundational computer science concepts and industry-ready development skills.
                  </p>
                  <p>
                    The <strong className="text-amber-600 dark:text-amber-400 font-semibold">Smart Campus ERP</strong> is a 
                    testament to our department's emphasis on real-world engineering. Designed and built right here, 
                    this platform eliminates manual attendance errors, automates eligibility reports for university exams, 
                    and empowers faculty members with instant digital class registers.
                  </p>
                  <p>
                    We emphasize daily laboratory programming practice, full-stack application development, 
                    and strict attendance compliance to ensure every BCA graduate from Nalanda College is ready 
                    for prestigious MCA admissions and IT industry roles.
                  </p>
                </div>

                {/* 3 Department Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <Laptop className="w-4 h-4 text-amber-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Modern IT Labs</h5>
                    <p className="text-[11px] text-slate-500">Dedicated programming terminals</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <Layers className="w-4 h-4 text-indigo-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Project-Based Learning</h5>
                    <p className="text-[11px] text-slate-500">Full-stack web & app development</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left">
                    <Users className="w-4 h-4 text-emerald-500 mb-1" />
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Faculty Mentorship</h5>
                    <p className="text-[11px] text-slate-500">Continuous doubt & career guidance</p>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Prof. Md Alauddin Khan</span>
                    <p className="text-[11px] text-slate-500">Coordinator & HOD, Computer Applications (BCA)</p>
                  </div>
                  <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg">
                    Dept. of BCA
                  </span>
                </div>

              </div>

              {/* Right Column: Coordinator Sir's Dignified Portrait & Title */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5 order-1 lg:order-2">
                <div className="relative group">
                  {/* Decorative glowing gradient ring */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />
                  
                  <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-white/20">
                    <img
                      src="/images/director.webp"
                      alt="Prof. Md Alauddin Khan, Coordinator & HOD"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "/images/hero-students.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Badge on photo */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Coordinator & HOD • BCA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name & Academic Credentials - Clean Typography (NO font-kapra glitch) */}
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 dark:text-white tracking-tight">
                    Prof. Md Alauddin Khan
                  </h3>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    Coordinator & HOD, Computer Applications (BCA)
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Department of Computer Applications • Nalanda College
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 rounded-full border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 font-bold">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Technical Education & Curriculum Lead</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. SECTION 4: SMART CAMPUS ERP GATEWAY (THE MAIN ACTION BUTTON)     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section id="erp-gateway" className="py-20 lg:py-28 relative scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 sm:p-14 lg:p-16 text-white border-2 border-indigo-700/50 shadow-2xl overflow-hidden text-center">
            
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>OFFICIAL DIGITAL ATTENDANCE & ACADEMIC GATEWAY</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-kapra uppercase tracking-tight text-white leading-[0.92]">
                  Enter The Smart Campus ERP Portal
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Real-time lecture attendance tracking, automated 75% university eligibility monitor, 
                  contactless barcode ID cards, and semester class timetables for Nalanda College students and faculty.
                </p>
              </div>

              {/* 4 Feature Highlights inside ERP */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl mx-auto pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">75% Target Engine</div>
                  <div className="text-[10px] text-slate-400">Automated alerts</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <QrCode className="w-5 h-5 text-amber-400 mb-1" />
                  <div className="text-xs font-bold text-white">Digital ID Card</div>
                  <div className="text-[10px] text-slate-400">Unique Barcode</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <CalendarDays className="w-5 h-5 text-indigo-400 mb-1" />
                  <div className="text-xs font-bold text-white">Dynamic Routine</div>
                  <div className="text-[10px] text-slate-400">Live timetable</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400 mb-1" />
                  <div className="text-xs font-bold text-white">Faculty Register</div>
                  <div className="text-[10px] text-slate-400">One-tap entry</div>
                </div>
              </div>

              {/* High-Impact Main Transition Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/portal"
                  className="w-full sm:w-auto px-10 py-5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black rounded-2xl shadow-[0_12px_32px_rgba(255,184,0,0.45)] hover:shadow-[0_16px_40px_rgba(255,184,0,0.6)] transition-all flex items-center justify-center gap-3 group cursor-pointer text-base uppercase tracking-wider scale-100 hover:scale-105 active:scale-95 duration-200"
                >
                  <span>ACCESS SMART CAMPUS ERP</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-5 bg-white/10 hover:bg-white/15 text-white border-2 border-white/20 hover:border-white/40 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
                >
                  <span>PORTAL LOGIN</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. CLEAN INSTITUTIONAL FOOTER                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center">
                <img
                  src={logo || "/images/college-logo.png"}
                  alt="Nalanda College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white uppercase text-sm">
                  {settings?.collegeName || "Nalanda College, Bihar Sharif"}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Constituent Unit of Patliputra University, Patna • Estd. 1870
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-semibold text-slate-300 text-xs">
              <a href="#college-overview" className="hover:text-white transition-colors">College Overview</a>
              <a href="#principal-desk" className="hover:text-white transition-colors">Principal's Desk</a>
              <a href="#coordinator-desk" className="hover:text-white transition-colors">BCA Coordinator</a>
              <Link to="/portal" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Access ERP</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} Nalanda College, Bihar Sharif. All rights reserved.
            </div>
            <div className="text-slate-400">
              Department of Computer Applications • Smart Campus ERP System
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default WelcomePage;
