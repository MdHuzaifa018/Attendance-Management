import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  CalendarDays,
  Bell,
  FileText,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Building2,
  BookOpen,
  Award,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  Check,
  TrendingUp,
  AlertTriangle,
  Send,
  Laptop,
  Quote,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import HomeNavbar from "../../components/HomeNavbar.jsx";
import HomeFooter from "../../components/HomeFooter.jsx";
import { getNotices } from "../../services/noticeService.js";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Monday");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await getNotices();
        if (data && data.length > 0) {
          setNotices(data.slice(0, 3));
        }
      } catch {
        // Fallback default notices
        setNotices([
          {
            _id: "1",
            title: "🚨 Mandatory 75% Attendance Requirement for Semester Examination",
            content: "Students failing to maintain 75% attendance in core subjects will be debarred as per university guidelines.",
            category: "Attendance",
            priority: "urgent",
          },
          {
            _id: "2",
            title: "📝 BCA 3rd Year Mid-Term Internal Assessment Schedule",
            content: "Mid-Term evaluations and practical viva will commence from next Monday in Computer Lab 1 & 2.",
            category: "Exam",
            priority: "high",
          },
          {
            _id: "3",
            title: "🎉 Annual College IT TechFest & Hackathon Registration",
            content: "Registrations are now open for Web Development, Algorithmic Coding, and Project Exhibition.",
            category: "Event",
            priority: "normal",
          },
        ]);
      }
    };
    loadNotices();
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  // Sample schedule for routine preview
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const sampleSchedule = {
    Monday: [
      { period: 1, time: "10:00 AM - 11:00 AM", subject: "Java Programming (BCA-301)", room: "Room 201", teacher: "Prof. Rajesh Kumar" },
      { period: 2, time: "11:00 AM - 12:00 PM", subject: "Database Systems (BCA-302)", room: "Room 201", teacher: "Dr. Sunita Sharma" },
      { period: 3, time: "12:30 PM - 01:30 PM", subject: "Software Engineering Lab", room: "Lab 1", teacher: "Prof. Rajesh Kumar" },
      { period: 4, time: "01:30 PM - 02:30 PM", subject: "Computer Networks & Security", room: "Lab 2", teacher: "Prof. Amit Verma" },
    ],
    Tuesday: [
      { period: 1, time: "10:00 AM - 11:00 AM", subject: "Operating Systems (BCA-303)", room: "Room 201", teacher: "Dr. Sunita Sharma" },
      { period: 2, time: "11:00 AM - 12:00 PM", subject: "Java Programming (BCA-301)", room: "Room 201", teacher: "Prof. Rajesh Kumar" },
      { period: 3, time: "12:30 PM - 01:30 PM", subject: "Web Development Lab", room: "Lab 1", teacher: "Prof. Amit Verma" },
    ],
    Wednesday: [
      { period: 1, time: "10:00 AM - 11:00 AM", subject: "Database Systems (BCA-302)", room: "Room 201", teacher: "Dr. Sunita Sharma" },
      { period: 2, time: "11:00 AM - 12:00 PM", subject: "Computer Networks (BCA-304)", room: "Room 201", teacher: "Prof. Amit Verma" },
      { period: 3, time: "12:30 PM - 01:30 PM", subject: "Algorithm Analysis & Design", room: "Lab 2", teacher: "Prof. Rajesh Kumar" },
    ],
    Thursday: [
      { period: 1, time: "10:00 AM - 11:00 AM", subject: "Operating Systems (BCA-303)", room: "Room 201", teacher: "Dr. Sunita Sharma" },
      { period: 2, time: "11:00 AM - 12:00 PM", subject: "Web Technology Lab (PHP/JS)", room: "Lab 1", teacher: "Prof. Amit Verma" },
    ],
    Friday: [
      { period: 1, time: "10:00 AM - 11:00 AM", subject: "Cloud Computing & DevOps", room: "Room 201", teacher: "Prof. Rajesh Kumar" },
      { period: 2, time: "11:00 AM - 12:00 PM", subject: "Cyber Security Fundamentals", room: "Lab 2", teacher: "Prof. Amit Verma" },
      { period: 3, time: "12:30 PM - 01:30 PM", subject: "Project Review & Viva", room: "Seminar Hall", teacher: "HOD Dept." },
    ],
    Saturday: [
      { period: 1, time: "10:00 AM - 12:00 PM", subject: "Weekly Practical Assessment", room: "Lab 1 & 2", teacher: "All Faculty" },
      { period: 2, time: "12:30 PM - 02:00 PM", subject: "TechFest Coding Workshop", room: "Auditorium", teacher: "Guest Speaker" },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 transition-colors">
      {/* ── 1. Top Navbar ── */}
      <HomeNavbar />

      {/* ── 2. Hero Section (Inspired by notyourcollege.com style) ── */}
      <section id="hero" className="relative pt-28 sm:pt-36 pb-20 overflow-hidden">
        {/* Background decorative bursts & ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-amber-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Kicker with hand-drawn marker underline doodle */}
              <div className="inline-block relative">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-800 dark:text-slate-200 font-poppins">
                  FOR NALANDA COLLEGE STUDENTS & FACULTY
                </span>
                {/* Hand-drawn marker underline stroke */}
                <svg className="w-full h-2.5 -mt-0.5 text-[#0038ff] dark:text-[#4d77ff]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.5C45.2 2.5 120.8 1.5 197.5 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Giant Bold Compressed Headline - Perfectly spaced, No Collision */}
              <div className="relative select-none my-2 sm:my-3">
                {/* Line 1: SMART CAMPUS */}
                <h1 className="text-slate-950 dark:text-white font-kapra tracking-[-1px] sm:tracking-[-1.5px] lg:tracking-[-2px] leading-[0.85] text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.4rem] 2xl:text-[7.6rem] uppercase whitespace-normal sm:whitespace-nowrap">
                  SMART CAMPUS
                </h1>

                {/* Line 2: NALANDA. with Crown Doodle */}
                <div className="relative inline-block mt-2 sm:mt-3">
                  {/* Clean Transparent Hand-Drawn Crown SVG Doodle (No black box) */}
                  <div className="absolute -top-7 sm:-top-9 md:-top-11 -right-8 sm:-right-12 md:-right-16 z-20 pointer-events-none transform rotate-12 drop-shadow-md">
                    <svg
                      className="w-12 sm:w-16 md:w-20 h-auto text-[#0038ff] dark:text-[#4d77ff]"
                      viewBox="0 0 120 75"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Curved base line */}
                      <path
                        d="M 16 62 C 45 56 75 56 104 62"
                        stroke="currentColor"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* Hand-drawn crown outline */}
                      <path
                        d="M 18 59 L 10 24 L 40 40 L 60 10 L 80 40 L 110 24 L 102 59 Z"
                        stroke="currentColor"
                        strokeWidth="4.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="currentColor"
                        fillOpacity="0.12"
                      />
                      {/* Tip crown circles */}
                      <circle cx="10" cy="22" r="3.5" fill="currentColor" />
                      <circle cx="60" cy="8" r="4.5" fill="currentColor" />
                      <circle cx="110" cy="22" r="3.5" fill="currentColor" />
                      {/* Whimsical radiant strokes */}
                      <path d="M 52 2 L 60 -4 L 68 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  <h1 className="text-[#0038ff] dark:text-[#4d77ff] font-kapra tracking-[-1px] sm:tracking-[-1.5px] lg:tracking-[-2px] leading-[0.85] text-6xl sm:text-7xl md:text-8xl lg:text-[6.2rem] xl:text-[7.6rem] 2xl:text-[8.8rem] uppercase">
                    NALANDA.
                  </h1>
                </div>
              </div>

              {/* Subtitle with Highlighting - Font Poppins */}
              <p className="text-base sm:text-lg lg:text-[1.25rem] 2xl:text-2xl font-poppins text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl font-normal">
                Build <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">real skills</span>,{" "}
                <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">real attendance</span>, and{" "}
                <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">real momentum</span> before
                the semester catches up.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate(getDashboardPath())}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base tracking-wide rounded-2xl shadow-xl shadow-amber-400/25 border-2 border-slate-950 transition-all cursor-pointer"
                  >
                    <span>GO TO {user?.role.toUpperCase()} DASHBOARD</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base tracking-wide rounded-2xl shadow-xl shadow-amber-400/25 border-2 border-slate-950 transition-all cursor-pointer group"
                    >
                      <span>ACCESS ERP PORTAL</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                    >
                      <span>STUDENT SIGNUP</span>
                      <span className="text-amber-500">⚡</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>120+ BCA-III Enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>75% University Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Patliputra Univ. Unit</span>
                </div>
              </div>

            </div>

            {/* Right Column: High-Energy Collage Visual with Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Dynamic Comic / Tech Starburst Background Accent */}
              <div className="absolute inset-0 -m-4 sm:-m-8 bg-gradient-to-tr from-amber-400 via-indigo-600 to-indigo-800 rounded-[2.5rem] rotate-2 opacity-90 shadow-2xl" />
              <div className="absolute inset-0 -m-2 sm:-m-4 bg-slate-950 rounded-[2.2rem] -rotate-1 shadow-xl" />

              {/* Main Image Container */}
              <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-900 group">
                <img
                  src="/hero-students.jpg"
                  alt="Nalanda College Students"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      ● Live Sync
                    </span>
                    <span className="text-xs font-bold text-slate-300">Nalanda College ERP v2.4</span>
                  </div>
                  <p className="text-sm font-black font-display tracking-wide">
                    Department of Computer Applications (BCA)
                  </p>
                </div>
              </div>

              {/* Floating Sticker Top Right: ATTEND. LEARN. REPEAT. */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-white dark:bg-slate-900 text-slate-950 dark:text-white px-4 py-2.5 rounded-2xl border-2 border-slate-950 dark:border-slate-600 shadow-2xl rotate-6 hover:rotate-0 transition-transform flex items-center gap-2.5 z-20">
                <span className="text-2xl">🚀</span>
                <div className="text-left font-kapra leading-[1.1] tracking-tight text-sm uppercase">
                  <div className="text-slate-950 dark:text-white font-bold">ATTEND.</div>
                  <div className="text-[#0038ff] dark:text-[#4d77ff] font-bold">LEARN.</div>
                  <div className="text-amber-500 font-bold">REPEAT.</div>
                </div>
              </div>

              {/* Floating Glassmorphic Badge Bottom Left: Live Attendance Rate */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      Live Attendance Rate
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                        94.8% Average
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">· Verified</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick Stats Marquee Strip ── */}
      <section className="bg-slate-950 text-white py-6 border-y-2 border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-800">
            <div>
              <div className="font-display font-black text-3xl sm:text-4xl text-amber-400">
                120+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                BCA-III Enrolled Students
              </p>
            </div>
            <div>
              <div className="font-display font-black text-3xl sm:text-4xl text-indigo-400">
                179+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Lectures Tracked
              </p>
            </div>
            <div>
              <div className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                75%+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Eligibility Benchmark
              </p>
            </div>
            <div>
              <div className="font-display font-black text-3xl sm:text-4xl text-white">
                1870
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                College Heritage Estd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Core Features Showcase (Neo-Modern Cards) ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest uppercase">
            POWERFUL ACADEMIC MODULES
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 dark:text-white uppercase tracking-tight">
            EVERYTHING MANAGED IN 1 PLACE.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Designed specifically for Nalanda College to eliminate manual attendance registers,
            paper circulars, and schedule confusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-indigo-600/30 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              1-Click Attendance Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Faculty can mark periods in under 10 seconds. Real-time percentages, auto-defaulter flags
              (&lt;75% warning, &lt;50% critical), and conflict prevention.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-amber-400/30 group-hover:scale-110 transition-transform">
              📅
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Live Interactive Timetable
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Monday to Saturday period breakdown showing subjects, room numbers, computer labs (Lab 1 & 2),
              and faculty assignments at a glance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              📢
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Digital Notice Board
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Targeted broadcasts for everyone, students, or faculty. Urgent alerts for exam dates,
              practical evaluations, and university guidelines.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-violet-600/30 group-hover:scale-110 transition-transform">
              🖨️
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Official PDF & Barcode ID Cards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Printable A4 attendance registers with Nalanda College letterhead & 3 formal signature blocks.
              Plus official dual-view student ID cards.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-pink-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
              📝
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Student Leave Hub
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Apply online for Medical, Academic, or Casual leave with reason documentation. Teachers and
              Admins review and approve with 1 click.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-cyan-500/30 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Internal Marks & SGPA
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              View internal assessment marks, practical marks, calculated subject grades, and cumulative
              SGPA performance records instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Interactive Routine & Timetable Showcase ── */}
      <section id="timetable" className="py-20 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                WEEKLY SCHEDULE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white uppercase tracking-tight mt-1">
                CLASS ROUTINE & LAB TIMINGS
              </h2>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveTab(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === d
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Periods List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleSchedule[activeTab]?.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    #{item.period}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {item.time}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {item.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.teacher}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    📍 {item.room}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Active Routine
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Live Notices Section ── */}
      <section id="notices" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
              OFFICIAL CIRCULARS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white uppercase tracking-tight mt-1">
              CAMPUS NOTICE BOARD
            </h2>
          </div>
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View All in Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map((n) => (
            <div
              key={n._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-3 relative hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    n.priority === "urgent"
                      ? "bg-red-500/10 text-red-600 border border-red-500/30"
                      : n.priority === "high"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                      : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/30"
                  }`}
                >
                  {n.priority}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {n.category}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {n.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {n.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Role Access Portals ── */}
      <section id="portals" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              WHO IS USING NALANDA ERP?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
              PORTALS FOR EVERY ROLE.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-400/20">
                  🎓
                </div>
                <h3 className="font-display font-black text-2xl">Student Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track your overall attendance percentage, monitor shortage alerts (&lt;75%), view weekly
                  class routines, submit leave applications, and print your student ID card.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Real-time Attendance Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>1-Click Student ID Card Print</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Online Leave Application</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl font-black text-xs hover:bg-amber-400 transition-colors"
              >
                <span>STUDENT LOGIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Faculty Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-600/20">
                  👨‍🏫
                </div>
                <h3 className="font-display font-black text-2xl">Faculty Desk</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast period marking with bulk Present/Absent buttons. Review attendance history, make
                  corrections with audit trails, and check daily teaching routines.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>10-Second Quick Bulk Marking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>Session Correction & Audit Trail</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>Leave Approval Workflow</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-500 transition-colors"
              >
                <span>FACULTY LOGIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-400/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/20">
                  ⚙️
                </div>
                <h3 className="font-display font-black text-2xl">Administration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full control over departments, courses, teachers, student rosters, routine editor,
                  and export of official college letterhead attendance sheets.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Official A4 PDF Print Register</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Timetable & Routine Editor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Export Granular CSV Data</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl font-black text-xs hover:bg-emerald-400 transition-colors"
              >
                <span>ADMIN LOGIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Mentorship & Developer Leadership Spotlight ── */}
      <section id="leadership" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest uppercase font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>VISION & CRAFTSMANSHIP</span>
          </div>
          <h2 className="font-kapra tracking-[-1px] sm:tracking-[-2px] text-4xl sm:text-6xl lg:text-7xl uppercase text-slate-950 dark:text-white leading-[0.9]">
            UNDER THE MENTORSHIP & LEAD ARCHITECT.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
            A real digital transformation engineered for Nalanda College — guided by visionary academic leadership and brought to life through relentless student craftsmanship.
          </p>
        </div>

        {/* Two-Column Grid: Mentor Card & Developer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch relative z-10">
          
          {/* ── CARD 1: Under the Mentorship of Md Alauddin Khan ── */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/50">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700" />

            <div className="space-y-6">
              {/* Profile Header (Photo + Title Info) */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Mentor Photo Container */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src="/images/director.webp"
                      alt="Prof. Md Alauddin Khan"
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Floating Verified Mentor Badge */}
                  <span className="absolute -bottom-2.5 -right-2 px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 font-poppins">
                    <span>👑</span>
                    <span>MENTOR</span>
                  </span>
                </div>

                {/* Mentor Meta */}
                <div className="space-y-1.5">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider font-poppins">
                    Under the Mentorship of
                  </div>
                  <h3 className="font-kapra text-3xl sm:text-4xl text-slate-950 dark:text-white uppercase tracking-tight leading-none">
                    Md Alauddin Khan
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-poppins">
                    Teacher & Academic Mentor
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-poppins">
                    Department of Computer Applications · Nalanda College, Biharsharif
                  </p>
                </div>
              </div>

              {/* Mentor Inspirational Quote Block */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 dark:from-indigo-950/30 dark:to-slate-950/50 border border-indigo-100 dark:border-indigo-900/40">
                <Quote className="w-6 h-6 text-indigo-500/40 absolute top-3 right-3" />
                <p className="text-xs sm:text-sm italic text-slate-800 dark:text-slate-200 font-poppins leading-relaxed">
                  "True education transcends textbooks. When students are empowered with the right discipline, technical vision, and accessible guidance, they don't just study modern technology — they create enterprise systems that solve real campus challenges."
                </p>
              </div>

              {/* Key Pillars */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-poppins">
                  Mentorship Impact & Guidance
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 font-poppins">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Academic Standards & 75% Rule</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Industry Project Advocacy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Digital Campus Vision</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Student Innovation Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 font-poppins">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-4 h-4" />
                <span>Nalanda College Faculty</span>
              </span>
              <span className="text-[11px] text-slate-400">Patliputra University</span>
            </div>
          </div>

          {/* ── CARD 2: Lead Architect & Developer (Md Huzaifa) ── */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/50">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

            <div className="space-y-6">
              {/* Profile Header (Photo + Title Info) */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Developer Photo Container */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-amber-400/30 dark:ring-amber-400/20 shadow-xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src="/images/developer.jpg"
                      alt="Md Huzaifa - Lead Developer"
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://res.cloudinary.com/qpxxnswd/image/upload/v1786433170/techugrow/raermdlduqbxo0qeksoy.jpg";
                      }}
                    />
                  </div>
                  {/* Floating Developer Badge */}
                  <span className="absolute -bottom-2.5 -right-2 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 font-poppins border border-slate-950/20">
                    <span>⚡</span>
                    <span>ARCHITECT</span>
                  </span>
                </div>

                {/* Developer Meta */}
                <div className="space-y-1.5">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider font-poppins">
                    Architected & Developed By
                  </div>
                  <h3 className="font-kapra text-3xl sm:text-4xl text-slate-950 dark:text-white uppercase tracking-tight leading-none">
                    Md Huzaifa
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-poppins">
                    Full-Stack Software Engineer & Student
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-poppins">
                    BCA 3rd Year · Nalanda College, Biharsharif
                  </p>
                </div>
              </div>

              {/* Developer Inspirational Line Block ("Best line ke saath") */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-yellow-50/40 dark:from-amber-950/20 dark:to-slate-950/50 border border-amber-200/70 dark:border-amber-900/40">
                <Quote className="w-6 h-6 text-amber-500/40 absolute top-3 right-3" />
                <p className="text-xs sm:text-sm italic text-slate-900 dark:text-slate-100 font-poppins leading-relaxed font-medium">
                  "We don't wait for the future to happen — we write the code that creates it. This ERP system was built with sheer passion to replace outdated paper registers with a blazing-fast, secure, and intuitive digital experience for every teacher and student in our college."
                </p>
              </div>

              {/* Technical Craftsmanship Pillars */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-poppins">
                  System Architecture & Features Built
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 font-poppins">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>MERN Full-Stack Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-Role Security (RBAC)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Automated PDF Letterhead Engine</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Live Routine & Shortage Engine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Meta & GitHub Link */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 font-poppins">
              <a
                href="https://github.com/MdHuzaifa018"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-xs hover:bg-amber-400 hover:text-slate-950 transition-colors shadow-sm"
              >
                <span>GitHub @MdHuzaifa018</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black">● Active Open-Source</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 9. Big Bottom High-Impact Call to Action ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-8 sm:p-14 text-slate-950 border-4 border-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10 text-left">
            <span className="text-xs font-black uppercase tracking-widest bg-slate-950 text-white px-3 py-1 rounded-full">
              START TODAY
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-tight">
              EXPERIENCE THE FUTURE OF COLLEGE ERP.
            </h2>
            <p className="text-sm font-semibold text-slate-800">
              Nalanda College, Biharsharif · Patliputra University Constituent Unit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
            <Link
              to="/login"
              className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all text-center"
            >
              ACCESS ERP PORTAL →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. Modern Footer ── */}
      <HomeFooter />
    </div>
  );
};

export default HomePage;
