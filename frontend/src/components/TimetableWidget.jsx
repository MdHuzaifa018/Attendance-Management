import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Loader2,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { getTimetable } from "../services/timetableService.js";
import { useAuth } from "../context/AuthContext.jsx";
import TimetableModal from "./TimetableModal.jsx";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableWidget = ({ classId }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Default to today's day of week if weekday, else Monday
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const initialDay = todayIndex >= 1 && todayIndex <= 6 ? DAYS[todayIndex - 1] : "Monday";

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTimetable(classId);
      setSchedules(data);
    } catch {
      // quiet error
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Find schedule for active selectedDay
  const activeDaySchedule = schedules.find((s) => s.dayOfWeek === selectedDay);
  const periods = activeDaySchedule?.periods || [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Class Schedule & Timetable
              </h3>
              <p className="text-xs text-slate-500">Weekly routine and lecture hours</p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Edit or create class timetable"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Routine
            </button>
          )}
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {DAYS.map((day) => {
            const isToday = day === initialDay;
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : isToday
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {day.slice(0, 3)}
                {isToday && " •"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : periods.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No periods scheduled for {selectedDay}. Enjoy your academic study break!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {periods.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:border-indigo-500/30 transition-all flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    Period #{p.periodNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {p.startTime} – {p.endTime}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  {p.subject?.name || "Subject Lecture"}
                  {p.subject?.code && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({p.subject.code})
                    </span>
                  )}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {p.teacher?.user?.name || "Faculty Assigned"}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <MapPin className="w-3 h-3" />
                    {p.roomNo || "Room 201"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Timetable Modal */}
      {isAdmin && (
        <TimetableModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchSchedule}
          initialClassId={classId}
          initialDay={selectedDay}
        />
      )}
    </div>
  );
};

export default TimetableWidget;
