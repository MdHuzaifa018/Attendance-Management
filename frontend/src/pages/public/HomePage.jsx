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
  ChevronLeft,
  Check,
  TrendingUp,
  AlertTriangle,
  Send,
  Laptop,
  Quote,
  Maximize2,
  X,
  Camera,
  Compass,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAuth } from "../../context/AuthContext.jsx";
import HomeNavbar from "../../components/HomeNavbar.jsx";
import HomeFooter from "../../components/HomeFooter.jsx";
import {
  getPublicStats,
  getPublicNotices,
  getPublicTimetable,
} from "../../services/publicService.js";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Monday");
  const [notices, setNotices] = useState([]);
  const [stats, setStats] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);

  // 📸 Nalanda College Campus Photo Gallery
  // NOTE: You can easily update any of these college image URLs with your actual campus photos!
  const galleryImages = [
    {
      id: 1,
      title: "Nalanda College Main Heritage Building",
      category: "Campus & Heritage",
      imageUrl: "/images/college-campus.jpg",
      desc: "Historic landmark campus established in 1870, Biharsharif. Constituent unit of Patliputra University.",
      tag: "🏛️ Main Campus",
    },
    {
      id: 2,
      title: "BCA Computer Applications Lab",
      category: "Labs & Classrooms",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
      desc: "Advanced computing center featuring programming environments, software engineering tools, and servers.",
      tag: "💻 Tech Lab",
    },
    {
      id: 3,
      title: "Central College Library & Research Hall",
      category: "Library & Seminars",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
      desc: "Comprehensive academic repository with thousands of volumes, journals, and digital research terminals.",
      tag: "📚 Research Hub",
    },
    {
      id: 4,
      title: "Annual IT TechFest & Coding Hackathon",
      category: "Events & TechFest",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
      desc: "State-level coding contests, web design competitions, and technology showcase exhibits.",
      tag: "🚀 TechFest",
    },
    {
      id: 5,
      title: "Academic Seminar Hall & Guest Lectures",
      category: "Library & Seminars",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
      desc: "Interactive lecture theater hosting keynote seminars, workshops, and student presentations.",
      tag: "🎤 Seminar Hall",
    },
    {
      id: 6,
      title: "Campus Green Lawns & Athletics Ground",
      category: "Student Life & Sports",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
      desc: "Lush botanical spaces and expansive sports facilities for cricket, football, and athletic meets.",
      tag: "⚽ Athletics",
    },
    {
      id: 7,
      title: "BCA Batch & Student Developer Squad",
      category: "Labs & Classrooms",
      imageUrl: "/hero-students.jpg",
      desc: "Enthusiastic students collaborating on real-world web apps, databases, and automated ERP projects.",
      tag: "⚡ BCA Batch",
    },
  ];

  const galleryCategories = [
    "All",
    "Campus & Heritage",
    "Labs & Classrooms",
    "Library & Seminars",
    "Events & TechFest",
    "Student Life & Sports",
  ];

  const filteredGallery =
    galleryFilter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === galleryFilter);

  const fallbackNotices = [
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
  ];

  useEffect(() => {
    const loadPublicData = async () => {
      // 1. Live Portal Stats from Backend MongoDB
      try {
        const liveStats = await getPublicStats();
        if (liveStats) {
          setStats(liveStats);
        }
      } catch {
        // Keeps fallback stats in render
      }

      // 2. Live Published Circulars from Backend MongoDB
      try {
        const liveNotices = await getPublicNotices();
        if (liveNotices && liveNotices.length > 0) {
          setNotices(liveNotices.slice(0, 3));
        } else {
          setNotices(fallbackNotices);
        }
      } catch {
        setNotices(fallbackNotices);
      }

      // 3. Live Academic Routine from Backend MongoDB
      try {
        const liveTimetable = await getPublicTimetable();
        if (
          liveTimetable &&
          Object.values(liveTimetable).some((arr) => Array.isArray(arr) && arr.length > 0)
        ) {
          setScheduleData(liveTimetable);
        }
      } catch {
        // Keeps default schedule in render
      }
    };

    loadPublicData();
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
                  <span>{stats?.studentsCount ? `${stats.studentsCount}+` : "120+"} BCA-III Enrolled</span>
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
                        {stats?.attendanceRate ? `${stats.attendanceRate}%` : "94.8%"} Average
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
                {stats?.studentsCount ? `${stats.studentsCount}+` : "120+"}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                BCA-III Enrolled Students
              </p>
            </div>
            <div>
              <div className="font-display font-black text-3xl sm:text-4xl text-indigo-400">
                {stats?.lecturesCount ? `${stats.lecturesCount}+` : "179+"}
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
                {stats?.heritageYear || 1870}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                College Heritage Estd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Campus Heritage & Photo Gallery Showcase (Eduvibe Dribbble Style) ── */}
      <section id="campus-gallery" className="relative py-20 lg:py-28 bg-grid-pattern border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-amber-400/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Block inspired by Dribbble Eduvibe shot */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            
            {/* Admissions / Academic Year Pill with Cap Icon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-poppins">
                NALANDA COLLEGE · ESTABLISHED 1870
              </span>
            </div>

            {/* Main Headline with Marker Underline */}
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white uppercase tracking-tight leading-[1.05]">
              Empowering{" "}
              <span className="relative inline-block text-indigo-600 dark:text-indigo-400">
                Young Minds
                {/* Hand-drawn curved marker underline doodle */}
                <svg className="w-full h-3 -mt-1 text-[#0038ff] dark:text-[#4d77ff]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.5C45.2 2.5 120.8 1.5 197.5 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              to Learn, Lead & Succeed.
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
              Our university is dedicated to providing transformative education, equipping students with the knowledge, skills, and discipline essential for lifelong success and global impact.
            </p>
          </div>

          {/* Grand Campus Photo Showcase (Matching Dribbble Central Image) */}
          <div className="relative mb-16">
            
            {/* Floating Dribbble-Style Stickers */}
            <div className="hidden sm:flex absolute -top-4 left-6 z-20 items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl -rotate-6">
              <span>🏆</span>
              <span>Excellence</span>
            </div>

            <div className="hidden sm:flex absolute -top-4 right-6 z-20 items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-xl rotate-6">
              <span>💡</span>
              <span>Innovation</span>
            </div>

            {/* The Main College Campus Frame */}
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-900 group">
              <img
                src="/images/college-campus.jpg"
                alt="Nalanda College Historical Campus"
                className="w-full h-[280px] sm:h-[420px] md:h-[500px] lg:h-[540px] object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Center Floating Circular Explore Button */}
              <a
                href="#gallery-slider"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-indigo-600/90 hover:bg-indigo-600 active:scale-95 text-white backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center p-2 border-2 border-white/50 transition-all hover:scale-110 group cursor-pointer"
              >
                <span className="text-base sm:text-xl font-black">↓</span>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider leading-tight">
                  Explore Campus
                </span>
              </a>

              {/* Bottom Campus Details Bar */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      Patliputra University Unit
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">Heritage Campus</span>
                  </div>
                  <h3 className="font-kapra text-2xl sm:text-4xl uppercase tracking-tight text-white drop-shadow-md">
                    Nalanda College, Biharsharif
                  </h3>
                </div>
                <div className="text-xs font-semibold text-slate-300 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  📍 Biharsharif, Nalanda, Bihar 803101
                </div>
              </div>
            </div>
          </div>

          {/* ── Photo Gallery Slider with Swiper.js ── */}
          <div id="gallery-slider" className="pt-6 space-y-8">
            
            {/* Category Filter Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-kapra text-2xl sm:text-3xl uppercase tracking-tight text-slate-950 dark:text-white">
                  CAMPUS PHOTO GALLERY
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer font-poppins ${
                      galleryFilter === cat
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Swiper Slider Component */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                className="pb-12"
              >
                {filteredGallery.map((img) => (
                  <SwiperSlide key={img.id}>
                    <div
                      onClick={() => setLightboxImage(img)}
                      className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:border-indigo-500/50"
                    >
                      {/* Image Frame with Aspect Ratio */}
                      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-900">
                        <img
                          src={img.imageUrl}
                          alt={img.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Top Category Badge */}
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-white/10 font-poppins">
                          {img.tag}
                        </span>

                        {/* Hover Zoom Icon */}
                        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-950 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-md">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-poppins">
                            {img.category}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-heading">
                            {img.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-poppins line-clamp-2 leading-relaxed">
                          {img.desc}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-8 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-center shadow-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-8 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-center shadow-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Lightbox Modal for Photo Gallery ── */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxImage.imageUrl}
              alt={lightboxImage.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-poppins">
                  {lightboxImage.category} · {lightboxImage.tag}
                </span>
                <h3 className="font-bold text-lg text-white font-heading">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-slate-400 font-poppins mt-1">
                  {lightboxImage.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Core Features Showcase (Neo-Modern Cards) ── */}
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
            {((scheduleData && scheduleData[activeTab] && scheduleData[activeTab].length > 0)
              ? scheduleData[activeTab]
              : sampleSchedule[activeTab]
            )?.map((item, idx) => (
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

      {/* ── 8. Dedicated Standalone Section: Under the Mentorship of Md Alauddin Khan ── */}
      <section id="mentorship" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest uppercase font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ACADEMIC LEADERSHIP & GUIDANCE</span>
          </div>
          <h2 className="font-kapra tracking-[-1px] sm:tracking-[-2px] text-4xl sm:text-6xl lg:text-7xl uppercase text-slate-950 dark:text-white leading-[0.9]">
            UNDER THE MENTORSHIP OF MD ALAUDDIN KHAN.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
            Inspiring academic excellence, technological discipline, and modern computer applications education at Nalanda College.
          </p>
        </div>

        {/* Grand Mentor Spotlight Card */}
        <div className="relative z-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden group hover:border-indigo-500/50 transition-all">
          {/* Top Gradient Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Mentor Portrait with Badges */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-64 sm:w-72 md:w-80 aspect-[4/5] rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-2xl bg-slate-100 dark:bg-slate-800 group">
                <img
                  src="/images/director.webp"
                  alt="Prof. Md Alauddin Khan"
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    ACADEMIC MENTOR
                  </div>
                  <h4 className="font-kapra text-2xl uppercase tracking-tight text-white">
                    Md Alauddin Khan
                  </h4>
                  <p className="text-xs text-slate-300 font-poppins">
                    Department of Computer Applications (BCA)
                  </p>
                </div>
              </div>

              {/* Floating Verified Mentor Badge */}
              <div className="absolute -bottom-4 bg-white dark:bg-slate-950 px-4 py-2 rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 shadow-xl flex items-center gap-2 z-20">
                <span className="text-lg">👑</span>
                <div className="text-left font-poppins">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Senior Faculty & Guide
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    15+ Years Guiding BCA Students
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mentor Vision & Impact Pillars */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider font-poppins">
                  Visionary Academic Guidance
                </div>
                <h3 className="font-kapra text-3xl sm:text-5xl text-slate-950 dark:text-white uppercase tracking-tight leading-none">
                  Prof. Md Alauddin Khan
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 font-poppins">
                  Teacher & Academic Mentor · Department of Computer Applications · Nalanda College, Biharsharif
                </p>
              </div>

              {/* Dignified Quote Block */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/40 dark:from-indigo-950/30 dark:to-slate-950/60 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                <Quote className="w-8 h-8 text-indigo-500/30 absolute top-4 right-4" />
                <p className="text-sm sm:text-base italic text-slate-800 dark:text-slate-200 font-poppins leading-relaxed font-medium">
                  "True education transcends the textbook. When students are empowered with the right discipline, technical vision, and accessible guidance, they don't just study modern technology — they create enterprise systems that solve real campus challenges."
                </p>
              </div>

              {/* 4 Mentorship Pillars */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 font-poppins">
                  Pillars of Academic Mentorship
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 font-poppins">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Academic Discipline & 75% Rule</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Real-World Project Advocacy</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Digital Campus Transformation</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Individual Student Empowerment</span>
                  </div>
                </div>
              </div>

              {/* Bottom Faculty Meta */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 font-poppins">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Patliputra University Constituent Faculty</span>
                </span>
                <span className="text-[11px] text-slate-400">Nalanda College · BCA Dept.</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Dedicated Standalone Section: Lead System Architect & Developer: Md Huzaifa ── */}
      <section id="developer" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black tracking-widest uppercase font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>LEAD SYSTEM ARCHITECT & FULL-STACK DEVELOPER</span>
          </div>
          <h2 className="font-kapra tracking-[-1px] sm:tracking-[-2px] text-4xl sm:text-6xl lg:text-7xl uppercase text-slate-950 dark:text-white leading-[0.9]">
            ARCHITECTED & DEVELOPED BY MD HUZAIFA.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
            Engineered from ground zero by a proud Nalanda College BCA student — replacing obsolete paper registers with an enterprise-grade digital ERP ecosystem.
          </p>
        </div>

        {/* Grand Developer Spotlight Card */}
        <div className="relative z-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden group hover:border-amber-400/50 transition-all">
          {/* Top Gradient Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Developer Story, Best Line Quote, and Tech Stack */}
            <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
              
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider font-poppins">
                  Creator & Full-Stack Architect
                </div>
                <h3 className="font-kapra text-3xl sm:text-5xl text-slate-950 dark:text-white uppercase tracking-tight leading-none">
                  Md Huzaifa
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 font-poppins">
                  Full-Stack Software Engineer & Student · BCA 3rd Year, Nalanda College
                </p>
              </div>

              {/* Developer Inspirational Line Block ("Best Line Ke Saath") */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-yellow-50/40 dark:from-amber-950/20 dark:to-slate-950/60 border-2 border-amber-200/80 dark:border-amber-900/50 shadow-sm">
                <Quote className="w-8 h-8 text-amber-500/30 absolute top-4 right-4" />
                <p className="text-sm sm:text-base italic text-slate-900 dark:text-slate-100 font-poppins leading-relaxed font-medium">
                  "We don't wait for the future to happen — we write the code that creates it. This ERP system was built with sheer passion late nights to replace outdated paper registers with a blazing-fast, secure, and intuitive digital experience for every teacher and student in our college."
                </p>
              </div>

              {/* Technical Craftsmanship & Tech Stack */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 font-poppins">
                  Engineering Stack & Modules Built
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    ⚛️ React 18 & Vite
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    🎨 Tailwind CSS v4
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    🟢 Node.js & Express API
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    🍃 MongoDB Atlas
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    🔒 Multi-Role RBAC Security
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    📄 Automated PDF Letterhead Engine
                  </span>
                </div>
              </div>

              {/* Action Buttons: GitHub & Open-Source Badge */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="https://github.com/MdHuzaifa018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-xs hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 transition-all shadow-lg cursor-pointer"
                >
                  <span>Follow on GitHub @MdHuzaifa018</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-poppins">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>100% Student Engineered for Nalanda College</span>
                </div>
              </div>

            </div>

            {/* Right Column: Developer Photo */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative order-1 lg:order-2">
              <div className="relative w-64 sm:w-72 md:w-80 aspect-[4/5] rounded-3xl overflow-hidden ring-4 ring-amber-400/30 dark:ring-amber-400/20 shadow-2xl bg-slate-100 dark:bg-slate-800 group">
                <img
                  src="/images/developer.jpg"
                  alt="Md Huzaifa - Lead Developer"
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://res.cloudinary.com/qpxxnswd/image/upload/v1786433170/techugrow/raermdlduqbxo0qeksoy.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    FULL-STACK ARCHITECT
                  </div>
                  <h4 className="font-kapra text-2xl uppercase tracking-tight text-white">
                    Md Huzaifa
                  </h4>
                  <p className="text-xs text-slate-300 font-poppins">
                    Department of Computer Applications (BCA)
                  </p>
                </div>
              </div>

              {/* Floating Developer Badge */}
              <div className="absolute -bottom-4 bg-white dark:bg-slate-950 px-4 py-2 rounded-2xl border-2 border-amber-400 shadow-xl flex items-center gap-2 z-20">
                <span className="text-lg">⚡</span>
                <div className="text-left font-poppins">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Lead Developer
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Architect & Creator of Nalanda ERP
                  </div>
                </div>
              </div>
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
