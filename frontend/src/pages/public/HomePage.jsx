import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
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
  Landmark,
  Mic,
  Trophy,
  Megaphone,
  Printer,
  BarChart3,
  MapPin,
  Code2,
  Palette,
  Server,
  Database,
  Cpu,
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

// Sample schedule for routine preview
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Premium Animated Counter Component
function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const parsed = parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
    const animation = animate(count, parsed, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

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
  ]
};

// Fallback notices shown instantly before API loads (prevents empty state)
const fallbackNotices = [
  {
    _id: "fallback-1",
    title: "🚨 Mandatory 75% Attendance Requirement for Semester Examination",
    content: "Students failing to maintain 75% attendance in core subjects will be debarred as per university guidelines.",
    category: "Attendance",
    priority: "urgent",
  },
  {
    _id: "fallback-2",
    title: "📝 BCA 3rd Year Mid-Term Internal Assessment Schedule",
    content: "Mid-Term evaluations and practical viva will commence from next Monday in Computer Lab 1 & 2.",
    category: "Exam",
    priority: "high",
  },
  {
    _id: "fallback-3",
    title: "🎉 Annual College IT TechFest & Hackathon Registration",
    content: "Registrations are now open for Web Development, Algorithmic Coding, and Project Exhibition.",
    category: "Event",
    priority: "normal",
  },
];

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Monday");
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [notices, setNotices] = useState(fallbackNotices);
  const [stats, setStats] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightboxImage, setLightboxImage] = useState(null);

  // Premium Animation Variants
  const premiumEasing = [0.16, 1, 0.3, 1];
  
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEasing } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  // 📸 Nalanda College Campus Photo Gallery
  // NOTE: You can easily update any of these college image URLs with your actual campus photos!
  const galleryImages = [
    {
      id: 1,
      title: "Nalanda College Campus",
      category: "Campus & Heritage",
      imageUrl: "https://iili.io/nzGmaEl.md.webp",
      desc: "Historic landmark campus established in 1870, Biharsharif. Constituent unit of Patliputra University.",
      tagIcon: <Landmark className="w-3.5 h-3.5" />,
      tagText: "Main Campus",
    },
    {
      id: 2,
      title: "College Event",
      category: "Events & TechFest",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQEO-umP2maccw/feedshare-shrink_1280/B4DaA9AlHWJgAQ-/0/1787729957697?e=1791417600&v=beta&t=07jC5rF3Mi29IhDceWWXz3Wq1Lm0LrD5m5X1Axo4ZJ0",
      desc: "Nalanda College Organized AI WorkShop For BCA & MCA Students",
      tagIcon: <Laptop className="w-3.5 h-3.5" />,
      tagText: "AI Workshop",
    },
    {
      id: 3,
      title: "College Event",
      category: "Events & TechFest",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQHMQoukCD-jpw/feedshare-shrink_480/B4DaA9AqGnIEAk-/0/1787729978348?e=1791417600&v=beta&t=zHiFcpAb0u_FUCYHbQwx3FtjqDXqF9lGlk_Y1xN7K54",
      desc: "Nalanda College Organized AI WorkShop For BCA & MCA Students",
      tagIcon: <Laptop className="w-3.5 h-3.5" />,
      tagText: "AI Workshop",
    },
    {
      id: 4,
      title: "BCA Computer Applications Lab",
      category: "Labs & Classrooms",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
      desc: "State-of-the-art 120-node computer lab with high-speed internet and development tools.",
      tagIcon: <Laptop className="w-3.5 h-3.5" />,
      tagText: "Tech Lab",
    },
    {
      id: 5,
      title: "Central College Library & Research Hall",
      category: "Library & Seminars",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
      desc: "Extensive collection of 50,000+ academic books, research journals, and digital e-resources.",
      tagIcon: <BookOpen className="w-3.5 h-3.5" />,
      tagText: "Research Hub",
    },
    {
      id: 6,
      title: "Annual IT TechFest & Coding Hackathon",
      category: "Events & TechFest",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
      desc: "Students participating in our flagship 48-hour coding hackathon and tech symposium.",
      tagIcon: <Award className="w-3.5 h-3.5" />,
      tagText: "TechFest",
    },
    {
      id: 7,
      title: "Academic Seminar Hall & Guest Lectures",
      category: "Library & Seminars",
      imageUrl: "https://nalandacollege.ac.in/storage/63/6887bc2655ca0_IMG-20250728-WA0019.jpg",
      desc: "Interactive lecture theater hosting keynote seminars, workshops, and student presentations.",
      tagIcon: <Mic className="w-3.5 h-3.5" />,
      tagText: "Seminar Hall",
    },
    {
      id: 8,
      title: "Campus Green Lawns & Athletics Ground",
      category: "Student Life & Sports",
      imageUrl: "https://nalandacollege.ac.in/storage/14/68359be85d644_gallery2.jpg",
      desc: "Lush botanical spaces and expansive sports facilities for cricket, football, and athletic meets.",
      tagIcon: <Trophy className="w-3.5 h-3.5" />,
      tagText: "Athletics",
    },
    {
      id: 9,
      title: "BCA Batch & Student Developer Squad",
      category: "Labs & Classrooms",
      imageUrl: "/images/hero-students.jpg",
      desc: "Our brilliant students collaborating on final year industry-level software projects.",
      tagIcon: <Users className="w-3.5 h-3.5" />,
      tagText: "Students",
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

  useEffect(() => {
    let cancelled = false; // Prevents stale updates when StrictMode remounts

    const loadPublicData = async () => {
      const [statsRes, noticesRes, timetableRes] = await Promise.allSettled([
        getPublicStats(),
        getPublicNotices(), // has built-in retry for Atlas cold-starts
        getPublicTimetable(),
      ]);

      if (cancelled) return; // Component unmounted, don't update state

      if (statsRes.status === "fulfilled" && statsRes.value) {
        setStats(statsRes.value);
      }
      
      // Only replace fallback if we got real data from the API
      if (noticesRes.status === "fulfilled" && noticesRes.value && noticesRes.value.length > 0) {
        setNotices(noticesRes.value);
      }
      // If API returned nothing, fallback notices (from useState init) remain

      if (timetableRes.status === "fulfilled" && timetableRes.value && timetableRes.value.classes && timetableRes.value.classes.length > 0) {
        setClasses(timetableRes.value.classes);
        setSelectedClassId(timetableRes.value.classes[0]._id);
        setScheduleData(timetableRes.value.timetablesByClass || {});
      } else {
        setClasses([{ _id: "bca1", name: "BCA First Year", code: "" }, { _id: "bca2", name: "BCA Second Year", code: "" }]);
        setSelectedClassId("bca1");
        setScheduleData({ "bca1": sampleSchedule, "bca2": sampleSchedule });
      }
    };

    loadPublicData();

    return () => { cancelled = true; }; // Cleanup: mark as cancelled on unmount
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 transition-colors overflow-x-hidden w-full max-w-[100vw]">
      {/* ── 1. Top Navbar ── */}
      <HomeNavbar />

      {/* ── 2. Hero Section (Inspired by notyourcollege.com style) ── */}
      <section id="hero" className="relative pt-24 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        {/* Background decorative bursts & ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-amber-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Bold Typography & CTAs */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-5 sm:space-y-6 text-left"
            >
              
              {/* Kicker with hand-drawn marker underline doodle */}
              <motion.div variants={fadeUpVariant} className="inline-block relative">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-800 dark:text-slate-200 font-poppins">
                  FOR NALANDA COLLEGE STUDENTS & FACULTY
                </span>
                {/* Hand-drawn marker underline stroke */}
                <svg className="w-full h-2.5 -mt-0.5 text-[#0038ff] dark:text-[#4d77ff]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.5C45.2 2.5 120.8 1.5 197.5 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* Giant Bold Compressed Headline - Perfectly spaced, No Collision */}
              <div className="relative select-none my-1 sm:my-3">
                {/* Line 1: SMART CAMPUS - Original Kapra Italic */}
                <motion.h1 variants={fadeUpVariant} className="text-slate-950 dark:text-white font-kapra tracking-tight sm:tracking-[-1.5px] lg:tracking-[-2px] leading-[0.9] text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.4rem] 2xl:text-[7.6rem] uppercase whitespace-normal break-words">
                  SMART CAMPUS
                </motion.h1>

                {/* Line 2: NALANDA. with Crown Doodle */}
                <motion.div variants={fadeUpVariant} className="relative inline-block mt-1 sm:mt-3">
                  {/* Clean Transparent Hand-Drawn Crown SVG Doodle (No black box) */}
                  <div className="absolute -top-5 sm:-top-9 md:-top-11 -right-3 sm:-right-8 md:-right-12 z-20 pointer-events-none transform rotate-12 drop-shadow-md">
                    <svg
                      className="w-10 sm:w-16 md:w-20 h-auto text-[#0038ff] dark:text-[#4d77ff]"
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

                  <h1 className="text-[#0038ff] dark:text-[#4d77ff] font-kapra tracking-tight sm:tracking-[-1.5px] lg:tracking-[-2px] leading-[0.9] text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] xl:text-[7.6rem] 2xl:text-[8.8rem] uppercase">
                    NALANDA.
                  </h1>
                </motion.div>
              </div>
{/* Stay on track with smart attendance, academic updates,
and everything you need to manage your college journey. */}
              {/* Subtitle with Highlighting - Font Poppins */}
              <motion.p variants={fadeUpVariant} className="text-base sm:text-lg lg:text-[1.25rem] 2xl:text-2xl font-poppins text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl font-normal">
                Stay on track with <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">smart attendance</span>,{" "}
                <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">academic updates</span>, and everything you need to manage your {" "}
                <span className="bg-[#ffe500] text-black px-1.5 py-0.5 rounded font-semibold">college journey.</span> 
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3.5 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate(getDashboardPath())}
                    className="interactive-premium flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-amber-400 text-slate-950 font-black text-sm sm:text-base tracking-wide rounded-2xl shadow-xl shadow-amber-400/25 border-2 border-slate-950 cursor-pointer"
                  >
                    <span>GO TO {user?.role.toUpperCase()} DASHBOARD</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="interactive-premium flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-amber-400 text-slate-950 font-black text-sm sm:text-base tracking-wide rounded-2xl shadow-xl shadow-amber-400/25 border-2 border-slate-950 cursor-pointer group"
                    >
                      <span>ACCESS ERP PORTAL</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-premium group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/register"
                      className="interactive-premium flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm sm:text-base rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm cursor-pointer"
                    >
                      <span>STUDENT SIGNUP</span>
                      <span className="text-amber-500">⚡</span>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Trust Indicators Bar */}
              <motion.div variants={fadeUpVariant} className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
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
              </motion.div>

            </motion.div>

            {/* Right Column: High-Energy Collage Visual with Floating Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Dynamic Comic / Tech Starburst Background Accent */}
              <div className="absolute inset-0 -m-2 sm:-m-6 bg-gradient-to-tr from-amber-400 via-indigo-600 to-indigo-800 rounded-[2rem] sm:rounded-[2.5rem] rotate-2 opacity-90 shadow-2xl pointer-events-none" />
              <div className="absolute inset-0 -m-1 sm:-m-3 bg-slate-950 rounded-[1.8rem] sm:rounded-[2.2rem] -rotate-1 shadow-xl pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-900 group">
                <img
                  src="/images/hero-students.jpg"
                  alt="Nalanda College Students"
                  className="w-full h-72 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Overlaid Bottom Title */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {/* <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                      ● Live Sync
                    </span> */}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300">Nalanda College ERP v1.0</span>
                  </div>
                  <p className="text-xs sm:text-sm font-black font-display tracking-wide">
                    Department of Computer Applications 
                  </p>
                </div>
              </div>

              {/* Floating Sticker Top Right: ATTEND. LEARN. REPEAT. */}
              <div className="absolute -top-4 -right-1 sm:-right-6 bg-white dark:bg-slate-900 text-slate-950 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-slate-950 dark:border-slate-600 shadow-2xl rotate-6 hover:rotate-0 transition-transform flex items-center gap-2 z-20">
                <span className="text-xl sm:text-2xl">🚀</span>
                <div className="text-left font-kapra leading-[1.1] tracking-tight text-xs sm:text-sm uppercase">
                  <div className="text-slate-950 dark:text-white font-bold">ATTEND.</div>
                  <div className="text-[#0038ff] dark:text-[#4d77ff] font-bold">LEARN.</div>
                  <div className="text-amber-500 font-bold">REPEAT.</div>
                </div>
              </div>

              {/* Floating Glassmorphic Badge Bottom Left: Live Attendance Rate */}
              {/* <div className="absolute -bottom-4 -left-1 sm:-left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-md">
                    ⚡
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-white">
                      Live Attendance Rate
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs sm:text-sm">
                        {stats?.attendanceRate ? `${stats.attendanceRate}%` : "94.8%"} Average
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">· Verified</span>
                    </div>
                  </div>
                </div>
              </div> */}

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick Stats Marquee Strip ── */}
      <section className="bg-slate-950 text-white py-6 border-y-2 border-slate-800 overflow-hidden relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-x divide-slate-800"
          >
            <motion.div variants={fadeUpVariant}>
              <div className="font-numbers font-black text-3xl sm:text-5xl text-amber-400">
                <AnimatedNumber value={stats?.studentsCount ? stats.studentsCount : 120} />+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                BCA-III Enrolled Students
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="font-numbers font-black text-3xl sm:text-5xl text-indigo-400">
                <AnimatedNumber value={stats?.lecturesCount ? stats.lecturesCount : 179} />+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Lectures Tracked
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="font-numbers font-black text-3xl sm:text-5xl text-emerald-400">
                <AnimatedNumber value={75} />%+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Eligibility Benchmark
              </p>
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <div className="font-numbers font-black text-3xl sm:text-5xl text-white">
                <AnimatedNumber value={stats?.heritageYear || 1870} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                College Heritage Estd.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Campus Heritage & Photo Gallery Showcase (Eduvibe Dribbble Style) ── */}
      <section id="campus-gallery" className="relative py-20 lg:py-28 bg-grid-pattern border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-amber-400/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Block inspired by Dribbble Eduvibe shot */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-14 space-y-4"
          >
            
            {/* Admissions / Academic Year Pill with Cap Icon */}
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-poppins">
                NALANDA COLLEGE · ESTABLISHED 1870
              </span>
            </motion.div>

            {/* Main Headline with Marker Underline */}
            <motion.h2 variants={fadeUpVariant} className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white uppercase tracking-tight leading-[1.05]">
              Empowering{" "}
              <span className="relative inline-block text-indigo-600 dark:text-indigo-400">
                Young Minds
                {/* Hand-drawn curved marker underline doodle */}
                <svg className="w-full h-3 -mt-1 text-[#0038ff] dark:text-[#4d77ff]" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 6.5C45.2 2.5 120.8 1.5 197.5 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              to Learn, Lead and Succeed.
            </motion.h2>

            {/* Subtitle */}
            <motion.p variants={fadeUpVariant} className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
              Our university is dedicated to providing transformative education, equipping students with the knowledge, skills, and discipline essential for lifelong success and global impact.
            </motion.p>
          </motion.div>

          {/* Grand Campus Photo Showcase (Matching Dribbble Central Image) */}
          <div className="relative mb-16">
            
            {/* Floating Dribbble-Style Stickers */}
            <div className="hidden sm:flex absolute -top-4 left-6 z-20 items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl -rotate-6">
              <span>🏆</span>
              <span>Excellence</span>
            </div>

            {/* <div className="hidden sm:flex absolute -top-4 right-6 z-20 items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-xl rotate-6">
              <span>💡</span>
              <span>Innovation</span>
            </div> */}

            {/* The Main College Campus Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: premiumEasing } }}
              viewport={{ once: true }}
              className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-900 group"
            >
              <img
                src="/images/college-campus.jpg"
                alt="Nalanda College Historical Campus"
                className="w-full h-[280px] sm:h-[420px] md:h-[500px] lg:h-[540px] object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Center Floating Circular Explore Button */}
              {/* <a
                href="#gallery-slider"
                className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-indigo-600/90 hover:bg-indigo-600 active:scale-95 text-white backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center p-2 border-2 border-white/50 transition-all hover:scale-110 group cursor-pointer"
              >
                <span className="text-base sm:text-xl font-black">↓</span>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider leading-tight">
                  Explore Campus
                </span>
              </a> */}

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
            </motion.div>
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
                        <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-white/10 font-poppins">
                          {img.tagIcon} {img.tagText}
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
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-poppins flex items-center gap-1.5">
                  {lightboxImage.category} · {lightboxImage.tagIcon} {lightboxImage.tagText}
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
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <motion.div variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest uppercase">
            POWERFUL ACADEMIC MODULES
          </motion.div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 dark:text-white uppercase tracking-tight">
            EVERYTHING MANAGED IN 1 PLACE.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Designed specifically for Nalanda College to eliminate manual attendance registers,
            paper circulars, and schedule confusion.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-indigo-600/30 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              One Click Attendance Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Faculty can mark periods in under 10 seconds. Real-time percentages, auto-defaulter flags
              (&lt;75% warning, &lt;50% critical), and conflict prevention.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-amber-400/30 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-6 h-6" />
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
              <Megaphone className="w-6 h-6" />
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
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Official PDF and Barcode ID Cards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Printable A4 attendance registers with Nalanda College letterhead & 3 formal signature blocks.
              Plus official dual-view student ID cards.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-pink-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
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
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">
              Internal Marks and SGPA
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              View internal assessment marks, practical marks, calculated subject grades, and cumulative
              SGPA performance records instantly.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── 5. Interactive Routine & Timetable Showcase ── */}
      <section id="timetable" className="py-20 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                WEEKLY SCHEDULE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white uppercase tracking-tight mt-1">
                CLASS ROUTINE AND LAB TIMINGS
              </h2>
            </div>

            {/* Class Selector and Day Pills */}
            <div className="flex flex-col gap-4 mt-4 md:mt-0">
              {classes.length > 0 && (
                <div className="flex items-center gap-2 md:self-end">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Class:</span>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} {cls.code ? `(${cls.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:self-end">
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
          </motion.div>

          {/* Periods List */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {((scheduleData && selectedClassId && scheduleData[selectedClassId] && scheduleData[selectedClassId][activeTab] && scheduleData[selectedClassId][activeTab].length > 0)
              ? scheduleData[selectedClassId][activeTab]
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
                  <span className="px-2 py-0.5 flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {item.room}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Active Routine
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
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
                  <GraduationCap className="w-6 h-6" />
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
                  <BookOpen className="w-6 h-6" />
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
                  <ShieldCheck className="w-6 h-6" />
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
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-black tracking-widest uppercase font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ACADEMIC LEADERSHIP & GUIDANCE</span>
          </motion.div>
          <motion.h2 variants={fadeUpVariant} className="font-kapra tracking-[-1px] sm:tracking-[-2px] text-4xl sm:text-6xl lg:text-7xl uppercase text-slate-950 dark:text-white leading-[0.9]">
            UNDER THE MENTORSHIP OF MD ALAUDDIN KHAN.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
            Inspiring academic excellence, technological discipline, and modern computer applications education at Nalanda College.
          </motion.p>
        </motion.div>

        {/* Grand Mentor Spotlight Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="relative z-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden group hover:border-indigo-500/50 transition-all"
        >
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
                <span className="text-indigo-600 dark:text-indigo-400"><Award className="w-6 h-6" /></span>
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
        </motion.div>
      </section>

      {/* ── 9. Dedicated Standalone Section: Lead System Architect & Developer: Md Huzaifa ── */}
      <section id="developer" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative z-10"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black tracking-widest uppercase font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>LEAD SYSTEM ARCHITECT & FULL-STACK DEVELOPER</span>
          </motion.div>
          <motion.h2 variants={fadeUpVariant} className="font-kapra tracking-[-1px] sm:tracking-[-2px] text-4xl sm:text-6xl lg:text-7xl uppercase text-slate-950 dark:text-white leading-[0.9]">
            ARCHITECTED AND DEVELOPED BY MD HUZAIFA.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-poppins max-w-2xl mx-auto leading-relaxed">
            Engineered from ground zero by a proud Nalanda College BCA student — replacing obsolete paper registers with an enterprise-grade digital ERP ecosystem.
          </motion.p>
        </motion.div>

        {/* Grand Developer Spotlight Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="relative z-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden group hover:border-amber-400/50 transition-all"
        >
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
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" /> React 18 & Vite
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <Palette className="w-3.5 h-3.5 text-sky-500" /> Tailwind CSS v4
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <Server className="w-3.5 h-3.5 text-green-500" /> Node.js & Express API
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <Database className="w-3.5 h-3.5 text-emerald-500" /> MongoDB Atlas
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Multi-Role RBAC Security
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 font-poppins">
                    <FileText className="w-3.5 h-3.5 text-amber-500" /> Automated PDF Letterhead Engine
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
                <span className="text-amber-500"><Cpu className="w-6 h-6" /></span>
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
        </motion.div>
      </section>

      {/* ── 9. Big Bottom High-Impact Call to Action ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-8 sm:p-14 text-slate-950 border-4 border-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
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
        </motion.div>
      </section>

      {/* ── 9. Modern Footer ── */}
      <HomeFooter />
    </div>
  );
};

export default HomePage;
