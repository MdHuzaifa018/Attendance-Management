import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { BookOpen, Clock, Users, ArrowRight, ClipboardCheck, FileCheck } from "lucide-react";
import { getAssignedSubjects } from "../../services/attendanceService.js";
import { getAttendanceSessions } from "../../services/attendanceHistoryService.js";
import toast from "react-hot-toast";
import LeaveManagementModal from "../../components/LeaveManagementModal.jsx";
import NoticeBoardWidget from "../../components/NoticeBoardWidget.jsx";
import TimetableWidget from "../../components/TimetableWidget.jsx";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [mySubjects, setMySubjects] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const subjectsRes = await getAssignedSubjects();
        const teacherSubjects = subjectsRes.subjects || [];
        setMySubjects(teacherSubjects);

        // Fetch recent attendance history to see sessions marked
        // Assuming we can just get history and find ones marked by this teacher
        // (If the backend doesn't filter by teacher automatically, we fetch all and slice)
        const historyRes = await getAttendanceSessions({ page: 1, limit: 10 });
        const historyList = historyRes.sessions || [];
        
        // Let's grab the most recent 3 unique sessions marked
        const recent = [];
        const seen = new Set();
        
        for (const record of historyList) {
          const key = `${record.class?._id}-${record.subject?._id}-${record.date}`;
          if (!seen.has(key)) {
            seen.add(key);
            recent.push(record);
          }
          if (recent.length >= 3) break;
        }
        setRecentSessions(recent);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Faculty Portal</p>
              <h1 className="text-xl font-extrabold leading-tight">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
            </div>
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            Manage your assigned classes and mark attendance.
          </p>
        </div>

        <button
          onClick={() => setShowLeaveModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer self-start md:self-auto"
        >
          <FileCheck className="w-4 h-4 text-emerald-200" /> Review Student Leaves
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Quick Actions & Subjects */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                My Assigned Subjects
              </h2>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : mySubjects.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No subjects assigned to you yet.
                </p>
                <p className="text-xs text-slate-400 mt-1">Contact the administrator to assign classes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mySubjects.map((subj) => (
                  <div key={subj._id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">{subj.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subj.code} • {subj.class?.name}</p>
                    <button
                      onClick={() => navigate("/teacher/attendance")}
                      className="mt-4 w-full py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Mark Attendance <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-emerald-500" />
              Recent Sessions
            </h2>

            {loading ? (
              <div className="flex justify-center py-5">
                <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 dark:text-slate-400">No recent attendance marked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {session.subject?.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {session.class?.name}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        {new Date(session.date).toLocaleDateString()} • {session.sessionType}
                      </p>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => navigate("/teacher/history")}
                  className="w-full py-2 mt-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
                >
                  View full history <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Notice Board & Timetable Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NoticeBoardWidget />
        <TimetableWidget />
      </div>

      {/* Leave Review Modal */}
      <LeaveManagementModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />
    </div>
  );
};

export default TeacherDashboard;
