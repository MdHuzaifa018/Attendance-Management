import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Award,
  CreditCard,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAttendanceSummary } from "../../services/studentAttendanceService.js";
import StudentIdCardModal from "../../components/StudentIdCardModal.jsx";
import LeaveManagementModal from "../../components/LeaveManagementModal.jsx";
import StudentMarksModal from "../../components/StudentMarksModal.jsx";
import NoticeBoardWidget from "../../components/NoticeBoardWidget.jsx";
import TimetableWidget from "../../components/TimetableWidget.jsx";

/**
 * StudentDashboard — Real dashboard with live attendance overview.
 * Shows the circular gauge, quick subject health chips, and a CTA to full attendance page.
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);

  useEffect(() => {
    getAttendanceSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const overview = summary?.overview;
  const student = summary?.student;

  const statusColor = {
    good: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
    warning: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
    critical: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50",
  };

  const pctBarColor = {
    good: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Welcome header ── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-violet-200 text-xs font-semibold uppercase tracking-wide">Student Portal</p>
              <h1 className="text-xl font-extrabold leading-tight">
                Welcome, {user?.name?.split(" ")[0]}!
              </h1>
            </div>
          </div>
          {student && (
            <p className="text-violet-200 text-sm mt-1">
              {student.class?.name} · {student.department?.name} · Roll #{student.rollNo}
            </p>
          )}
        </div>

        {/* Action Buttons: ID Card, Apply Leave, View Grade Card */}
        {student && (
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setShowIdCard(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold shadow-lg transition-all backdrop-blur-md cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" /> ID Card
            </button>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold shadow-lg transition-all backdrop-blur-md cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-300" /> Apply Leave
            </button>
            <button
              onClick={() => setShowMarksModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold shadow-lg transition-all backdrop-blur-md cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-violet-300" /> Internal Marks
            </button>
          </div>
        )}
      </div>

      {/* ── Low Attendance Alert Banner (Phase 7 Alert) ── */}
      {overview && overview.overallPercent < 75 && (
        <div
          className={`rounded-2xl p-4 border flex items-start gap-3.5 shadow-md ${
            overview.overallPercent < 50
              ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
          }`}
        >
          <div
            className={`p-2 rounded-xl flex-shrink-0 ${
              overview.overallPercent < 50 ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
            }`}
          >
            {overview.overallPercent < 50 ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm mb-0.5">
              {overview.overallPercent < 50
                ? "🚨 Critical Attendance Shortage Alert!"
                : "⚠️ Low Attendance Notice"}
            </h4>
            <p className="leading-relaxed opacity-90">
              Your overall attendance is currently{" "}
              <strong className="font-extrabold">{overview.overallPercent}%</strong>. The University mandates a
              minimum of <strong>75% attendance</strong> to be eligible for semester examination forms and hall tickets.
              {overview.overallPercent < 50 &&
                " You are at immediate risk of debarment. Please report to your H.O.D office immediately."}
            </p>
          </div>
        </div>
      )}

      {/* ── Attendance overview card ── */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !overview ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <ClipboardList className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">No attendance recorded yet</p>
          <p className="text-xs text-slate-400 mt-1">Check back after your teacher marks attendance</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
            <button
              onClick={() => navigate("/student/attendance")}
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
            >
              View Full Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Overall % big display */}
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0
              ${statusColor[overview.overallStatus]}`}>
              <span className="text-3xl font-extrabold leading-none">{overview.overallPercent}%</span>
              <span className="text-xs font-semibold mt-0.5 capitalize">
                {overview.overallStatus === "good" ? "Good" : overview.overallStatus === "warning" ? "Low" : "Critical"}
              </span>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Classes Attended</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {overview.totalAttended}
                </span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Classes Absent</span>
                <span className="font-bold text-red-500">{overview.totalAbsent}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Total Conducted</span>
                <span className="font-bold">{overview.totalConducted}</span>
              </div>
              {/* Mini progress bar */}
              <div className="pt-1">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pctBarColor[overview.overallStatus]} transition-all duration-700`}
                    style={{ width: `${Math.min(overview.overallPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0%</span>
                  <span>75% minimum</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert */}
          {overview.overallStatus !== "good" && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm
              ${overview.overallStatus === "critical"
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"}`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">
                {overview.overallStatus === "critical"
                  ? "Critically low attendance — exam eligibility at risk!"
                  : "Attendance below 75% — attend all upcoming classes to improve"}
              </span>
            </div>
          )}

          {/* Subjects quick health */}
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.subjects.slice(0, 4).map((subj) => (
              <button
                key={subj._id}
                onClick={() => navigate("/student/attendance")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0
                  ${subj.status === "good" ? "bg-emerald-500" : subj.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{subj.name}</p>
                  <p className="text-[10px] text-slate-400">{subj.code}</p>
                </div>
                <span className={`text-xs font-bold flex-shrink-0
                  ${subj.status === "good" ? "text-emerald-600 dark:text-emerald-400" : subj.status === "warning" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                  {subj.percent}%
                </span>
              </button>
            ))}
            {summary.subjects.length > 4 && (
              <button
                onClick={() => navigate("/student/attendance")}
                className="sm:col-span-2 text-xs text-violet-600 dark:text-violet-400 font-semibold py-2 hover:text-violet-800 dark:hover:text-violet-300 transition-colors flex items-center justify-center gap-1"
              >
                View all {summary.subjects.length} subjects <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Quick nav cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/student/attendance")}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-left hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
            My Attendance
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Full subject-wise breakdown, % progress, eligibility status & history
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-violet-600 dark:text-violet-400">
            View Report <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl flex items-center justify-center mb-3">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Eligibility</h3>
          {overview ? (
            <p className={`text-xs mt-1 font-semibold
              ${overview.overallStatus === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {overview.overallStatus === "good"
                ? `✓ Eligible — ${overview.overallPercent}% attendance`
                : `✗ Not Eligible — ${overview.overallPercent}% (need 75%)`}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">Requires attendance data</p>
          )}
          <p className="text-xs text-slate-500 mt-2">
            Minimum 75% attendance required across all subjects for exam eligibility.
          </p>
        </div>
      </div>

      {/* ── Notice Board & Timetable Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NoticeBoardWidget />
        <TimetableWidget classId={student?.class?._id} />
      </div>

      {/* ── Student ID Card Modal ── */}
      <StudentIdCardModal
        isOpen={showIdCard}
        onClose={() => setShowIdCard(false)}
        student={student}
      />

      {/* ── Leave Application Modal ── */}
      <LeaveManagementModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />

      {/* ── Student Internal Marks Modal ── */}
      <StudentMarksModal
        isOpen={showMarksModal}
        onClose={() => setShowMarksModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;
