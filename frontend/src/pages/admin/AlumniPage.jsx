import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Search,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Loader2,
  Building,
  Hash,
} from "lucide-react";
import { getGraduatedStudents } from "../../services/studentService.js";

/* ─── Empty state ───────────────────────────────────────────── */
const EmptyState = ({ hasSearch }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-2xl flex items-center justify-center mb-4">
      <GraduationCap className="w-8 h-8 text-purple-400" />
    </div>
    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">
      {hasSearch ? "No alumni found" : "No alumni yet"}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
      {hasSearch
        ? "Try a different name, roll number, or batch year."
        : "Students who complete their course will appear here after promotion."}
    </p>
  </div>
);

/* ─── Alumni Card ───────────────────────────────────────────── */
const AlumniCard = ({ student }) => {
  const initials = (student.user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300",
    "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300",
  ];
  const colorClass = colors[student.rollNo?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex gap-4 items-start">
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${colorClass}`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
          {student.user?.name || "Unknown"}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Hash className="w-3 h-3" />
            {student.rollNo || "—"}
          </span>
          {student.department?.name && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Building className="w-3 h-3" />
              {student.department.name}
            </span>
          )}
          {student.batch && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3 h-3" />
              {student.batch}
            </span>
          )}
        </div>
      </div>

      {/* Badge */}
      <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
        <GraduationCap className="w-3 h-3" />
        Alumni
      </span>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */
const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const data = await getGraduatedStudents({ limit: 5000 });
        setAlumni(data.students || []);
      } catch {
        toast.error("Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return alumni;
    return alumni.filter(
      (s) =>
        s.rollNo?.toLowerCase().includes(term) ||
        s.user?.name?.toLowerCase().includes(term) ||
        s.batch?.toLowerCase().includes(term) ||
        s.department?.name?.toLowerCase().includes(term)
    );
  }, [alumni, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[11px] font-bold border border-purple-200 dark:border-purple-800">
                Passed Out
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Alumni Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Students who have graduated and passed out of the college
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <div className="text-right">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {loading ? "—" : alumni.length}
              </p>
              <p className="text-xs text-slate-500 font-medium">Total Alumni</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Banner ─────────────────────────── */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-xl px-4 py-3 flex items-start gap-3">
        <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
          Alumni are automatically moved here when promoted to "Graduated" status via the Promotions module. You cannot manually add alumni.
        </p>
      </div>

      {/* ── Search Bar ──────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="alumni-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll no, batch or department…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex-shrink-0"
            >
              Clear
            </button>
          )}
          <p className="text-xs text-slate-400 flex-shrink-0">
            {filtered.length} of {alumni.length} alumni
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading alumni records…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <EmptyState hasSearch={!!searchTerm} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <AlumniCard key={student._id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniPage;
