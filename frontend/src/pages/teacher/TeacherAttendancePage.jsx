import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ClipboardCheck,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getAssignedSubjects,
  getAttendanceSheet,
  markAttendance,
  getClasses,
  getSubjectsByClass,
} from "../../services/attendanceService.js";

const SESSION_OPTIONS = [
  { value: "regular", label: "Regular Session" },
  { value: "practical", label: "Practical / Lab" },
  { value: "extra", label: "Extra Lecture" },
  { value: "tutorial", label: "Tutorial Session" },
];

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Filter & Config selections
  const [classesList, setClassesList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [subjectsList, setSubjectsList] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSession, setSelectedSession] = useState("regular");

  // Sheet state
  const [sheetData, setSheetData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Initial Load: classes & subjects
  useEffect(() => {
    setLoadingLookups(true);
    if (isAdmin) {
      // Admin can select from all classes
      getClasses()
        .then((cls) => {
          setClassesList(cls || []);
          if (cls?.length > 0) {
            setSelectedClassId(cls[0]._id);
          }
        })
        .catch(() => toast.error("Could not load classes"))
        .finally(() => setLoadingLookups(false));
    } else {
      // Teacher: load their assigned subjects & classes
      getAssignedSubjects()
        .then((res) => {
          const subs = res.subjects || [];
          setSubjectsList(subs);

          // Extract unique classes from assigned subjects
          const classMap = new Map();
          subs.forEach((s) => {
            if (s.class && !classMap.has(s.class._id)) {
              classMap.set(s.class._id, s.class);
            }
          });
          const uniqueClasses = Array.from(classMap.values());
          setClassesList(uniqueClasses);

          if (uniqueClasses.length > 0) {
            setSelectedClassId(uniqueClasses[0]._id);
          }
          if (subs.length > 0) {
            setSelectedSubjectId(subs[0]._id);
          }
        })
        .catch(() => toast.error("Could not load assigned subjects"))
        .finally(() => setLoadingLookups(false));
    }
  }, [isAdmin]);

  // 2. When Class changes (for Admin): load subjects in that class
  useEffect(() => {
    if (!isAdmin || !selectedClassId) return;

    getSubjectsByClass(selectedClassId)
      .then((subs) => {
        setSubjectsList(subs || []);
        if (subs?.length > 0) {
          setSelectedSubjectId(subs[0]._id);
        } else {
          setSelectedSubjectId("");
        }
      })
      .catch(() => toast.error("Failed to load class subjects"));
  }, [isAdmin, selectedClassId]);

  // 3. For Teacher: filter subjects dropdown based on selected class
  const availableSubjects = useMemo(() => {
    if (isAdmin) return subjectsList;
    return subjectsList.filter((s) => String(s.class?._id || s.class) === String(selectedClassId));
  }, [isAdmin, subjectsList, selectedClassId]);

  // Auto-select first available subject if current selection doesn't match
  useEffect(() => {
    if (availableSubjects.length > 0) {
      const match = availableSubjects.some((s) => s._id === selectedSubjectId);
      if (!match) {
        setSelectedSubjectId(availableSubjects[0]._id);
      }
    } else {
      setSelectedSubjectId("");
    }
  }, [availableSubjects, selectedSubjectId]);

  // 4. Fetch Attendance Sheet for selected Class + Subject + Date + Session
  const fetchSheet = useCallback(async () => {
    if (!selectedClassId || !selectedSubjectId || !selectedDate) {
      setSheetData(null);
      setStudents([]);
      return;
    }

    // Prevent race condition when switching classes
    const validSubject = availableSubjects.some((s) => s._id === selectedSubjectId);
    if (!validSubject) return;

    setLoadingSheet(true);
    try {
      const data = await getAttendanceSheet({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        date: selectedDate,
        session: selectedSession,
      });

      setSheetData(data);
      setStudents(data.students || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load sheet";
      toast.error(msg);
      setSheetData(null);
      setStudents([]);
    } finally {
      setLoadingSheet(false);
    }
  }, [selectedClassId, selectedSubjectId, selectedDate, selectedSession]);

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  // 5. Attendance Status Controls
  const handleToggleStatus = (studentId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s._id === studentId) {
          return {
            ...s,
            status: s.status === "present" ? "absent" : "present",
          };
        }
        return s;
      })
    );
  };

  const handleSetStatus = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    toast.success(`Marked all as ${status === "present" ? "Present" : "Absent"}`);
  };

  const handleInvertAll = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.status === "present" ? "absent" : "present",
      }))
    );
    toast("Inverted attendance status", { icon: "🔄" });
  };

  // 6. Submit Attendance
  const handleSave = async () => {
    if (!students || students.length === 0) {
      toast.error("No student records to save");
      return;
    }

    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        status: s.status,
      }));

      const res = await markAttendance({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        date: selectedDate,
        session: selectedSession,
        records,
        updateIfExists: true, // safe to update if already recorded
      });

      toast.success(res.message || "Attendance saved successfully");
      fetchSheet();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit attendance";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Live Metrics Calculations
  const totalEnrolled = students.length;
  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const attendanceRate =
    totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Mark Daily Attendance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select academic course, date, and record attendance for enrolled students
          </p>
        </div>

        {sheetData?.isMarked && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            Attendance already recorded for this session (Edit Mode)
          </div>
        )}
      </div>

      {/* ── Configuration Selector Card ─────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Session Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loadingLookups || classesList.length === 0}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              {classesList.length === 0 ? (
                <option value="">No classes found</option>
              ) : (
                classesList.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.code} — {cls.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Course / Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={loadingLookups || availableSubjects.length === 0}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              {availableSubjects.length === 0 ? (
                <option value="">No subjects in class</option>
              ) : (
                availableSubjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.code} — {sub.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
            />
          </div>

          {/* Session Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Session Type
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              {SESSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Live Metrics & Action Controls ──────────────────────────────── */}
      {totalEnrolled > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          {/* Metrics badges */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-slate-500" />
              Total: {totalEnrolled}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Present: {presentCount}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-700 dark:text-rose-300">
              <XCircle className="w-4 h-4 text-rose-500" />
              Absent: {absentCount}
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                attendanceRate >= 75
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  : attendanceRate >= 50
                  ? "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                  : "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
              }`}
            >
              Rate: {attendanceRate}%
            </div>
          </div>

          {/* Bulk quick toggles */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleMarkAll("present")}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 rounded-xl transition-colors cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll("absent")}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-700/60 rounded-xl transition-colors cursor-pointer"
            >
              Mark All Absent
            </button>
            <button
              onClick={handleInvertAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Invert Present / Absent"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Student Attendance Sheet Table ──────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        {(loadingSheet || (availableSubjects.length > 0 && !availableSubjects.some(s => s._id === selectedSubjectId))) ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium">Loading attendance sheet...</p>
          </div>
        ) : !selectedClassId || !selectedSubjectId ? (
          <div className="py-20 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Select an academic class and course to load the student sheet
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No students enrolled in this class
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Add students to this class first via the Students Management directory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 w-16">#</th>
                  <th className="px-6 py-3.5">Roll Number</th>
                  <th className="px-6 py-3.5">Candidate Name</th>
                  <th className="px-6 py-3.5">Stats</th>
                  <th className="px-6 py-3.5 text-center w-64">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-white">
                {students.map((student, index) => {
                  const isPresent = student.status === "present";

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Index */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {index + 1}
                      </td>

                      {/* Roll Number */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {student.rollNo}
                        </span>
                      </td>

                      {/* Student Name */}
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 w-fit">
                            Today: {student.todayAttended}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 w-fit">
                            Overall: {student.totalAttended}
                          </span>
                        </div>
                      </td>

                      {/* Attendance Toggle Pills */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 gap-1">
                          {/* Present Pill */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(student._id, "present")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isPresent
                                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-102"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Present
                          </button>

                          {/* Absent Pill */}
                          <button
                            type="button"
                            onClick={() => handleSetStatus(student._id, "absent")}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              !isPresent
                                ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30 scale-102"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Bottom Floating Sticky Save Bar ─────────────────────────────── */}
      {students.length > 0 && (
        <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {sheetData?.isMarked
                  ? "Update Existing Attendance"
                  : "Ready to Submit Attendance Sheet"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {presentCount} Present, {absentCount} Absent out of {totalEnrolled} students
              </p>
            </div>
          </div>

          <button
            id="save-attendance-btn"
            onClick={handleSave}
            disabled={saving || loadingSheet}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Attendance...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {sheetData?.isMarked ? "Update Attendance" : "Save Attendance"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendancePage;
