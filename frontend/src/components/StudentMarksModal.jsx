import { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  X,
  Loader2,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  Printer,
} from "lucide-react";
import { getMyMarks, getStudentMarks } from "../services/marksService.js";

const StudentMarksModal = ({ isOpen, onClose, studentId, studentName }) => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchMarks = async () => {
        try {
          setLoading(true);
          const data = studentId ? await getStudentMarks(studentId) : await getMyMarks();
          setMarks(data);
        } catch {
          // quiet error
        } finally {
          setLoading(false);
        }
      };
      fetchMarks();
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  // Calculate totals
  const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
  const totalObtained = marks.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const sgpa = (overallPercentage / 9.5).toFixed(1);

  const getGrade = (score) => {
    if (score >= 90) return { grade: "A+", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (score >= 80) return { grade: "A", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
    if (score >= 70) return { grade: "B+", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
    if (score >= 60) return { grade: "B", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    return { grade: "C", color: "text-red-400 bg-red-500/10 border-red-500/30" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              Academic Assessment & Internal Marks
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top KPI Card */}
          <div className="bg-gradient-to-r from-indigo-50 via-indigo-50/50 to-white dark:from-indigo-950 dark:via-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                Cumulative Evaluation
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {studentName ? `${studentName}'s Grade Card` : "My Assessment Performance"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Continuous internal evaluation marks</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{overallPercentage}%</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Overall Score</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 flex flex-col items-center justify-center">
                <span className="text-base font-black text-indigo-700 dark:text-indigo-300 leading-none">{sgpa}</span>
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">SGPA</span>
              </div>
            </div>
          </div>

          {/* Marks List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
            </div>
          ) : marks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
              No internal assessment marks recorded yet for this session.
            </div>
          ) : (
            <div className="space-y-2.5">
              {marks.map((m) => {
                const gradeInfo = getGrade(m.marksObtained);
                return (
                  <div
                    key={m._id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {m.subject?.name || "Subject"}
                        </h5>
                        {m.subject?.code && (
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded">
                            {m.subject.code}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.examType} · {m.remarks || "Assessed"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {m.marksObtained}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400"> / {m.maxMarks}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-xs font-black ${gradeInfo.color}`}
                      >
                        {gradeInfo.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMarksModal;
