import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
  Save,
  Loader2,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import { getClasses } from "../services/classService.js";
import { getSubjects } from "../services/subjectService.js";
import { getTeachers } from "../services/teacherService.js";
import { getTimetable, saveTimetable } from "../services/timetableService.js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableModal = ({ isOpen, onClose, onSuccess, initialClassId, initialDay }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedClass, setSelectedClass] = useState(initialClassId || "");
  const [selectedDay, setSelectedDay] = useState(initialDay || "Monday");
  const [periods, setPeriods] = useState([]);

  const [loadingLookups, setLoadingLookups] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load initial lookups (Classes, Teachers)
  useEffect(() => {
    if (!isOpen) return;

    const loadLookups = async () => {
      setLoadingLookups(true);
      try {
        const [clsRes, tchRes] = await Promise.all([
          getClasses({ all: true }),
          getTeachers({ limit: 100 }),
        ]);

        const classList = clsRes.classes || [];
        setClasses(classList);
        setTeachers(tchRes.teachers || []);

        if (!selectedClass && classList.length > 0) {
          // Default to BCA-III if available, else first class
          const bca = classList.find((c) => c.code === "BCA-III");
          setSelectedClass(bca ? bca._id : classList[0]._id);
        }
      } catch {
        toast.error("Failed to load classes or teachers");
      } finally {
        setLoadingLookups(false);
      }
    };

    loadLookups();
  }, [isOpen]);

  // Load subjects when selectedClass changes
  useEffect(() => {
    if (!selectedClass) return;
    getSubjects({ classId: selectedClass, all: true })
      .then((res) => {
        setSubjects(res.subjects || []);
      })
      .catch(() => {});
  }, [selectedClass]);

  // Load schedule for selectedClass + selectedDay
  useEffect(() => {
    if (!selectedClass || !selectedDay || !isOpen) return;

    const fetchDaySchedule = async () => {
      setLoadingSchedule(true);
      try {
        const data = await getTimetable(selectedClass, selectedDay);
        const daySchedule = data.find((s) => s.dayOfWeek === selectedDay);

        if (daySchedule && daySchedule.periods && daySchedule.periods.length > 0) {
          setPeriods(
            daySchedule.periods.map((p) => ({
              periodNumber: p.periodNumber,
              startTime: p.startTime || "10:00 AM",
              endTime: p.endTime || "11:00 AM",
              subject: p.subject?._id || p.subject || "",
              teacher: p.teacher?._id || p.teacher || "",
              roomNo: p.roomNo || "Room 201",
            }))
          );
        } else {
          // Default template with 1 period
          setPeriods([
            {
              periodNumber: 1,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              subject: "",
              teacher: "",
              roomNo: "Room 201",
            },
          ]);
        }
      } catch {
        toast.error("Failed to load schedule for this day");
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchDaySchedule();
  }, [selectedClass, selectedDay, isOpen]);

  if (!isOpen) return null;

  const handleAddPeriod = () => {
    const nextNum = periods.length + 1;
    let nextStart = "11:00 AM";
    let nextEnd = "12:00 PM";

    if (periods.length > 0) {
      const last = periods[periods.length - 1];
      nextStart = last.endTime || "11:00 AM";
      nextEnd = "12:00 PM";
    }

    setPeriods([
      ...periods,
      {
        periodNumber: nextNum,
        startTime: nextStart,
        endTime: nextEnd,
        subject: subjects[0]?._id || "",
        teacher: "",
        roomNo: "Room 201",
      },
    ]);
  };

  const handleRemovePeriod = (index) => {
    const filtered = periods.filter((_, idx) => idx !== index);
    // Re-index periods
    const reindexed = filtered.map((p, idx) => ({ ...p, periodNumber: idx + 1 }));
    setPeriods(reindexed);
  };

  const handlePeriodChange = (index, field, value) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      return toast.error("Please select a class");
    }

    // Validate that every period has a subject
    for (const p of periods) {
      if (!p.subject) {
        return toast.error(`Please select a subject for Period #${p.periodNumber}`);
      }
    }

    try {
      setSaving(true);
      await saveTimetable({
        classId: selectedClass,
        dayOfWeek: selectedDay,
        periods,
      });

      toast.success(`Timetable for ${selectedDay} saved successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save timetable");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Manage Class Schedule & Timetable
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure periods, lecture timings, faculty, and room allocations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Class & Day Selector */}
        <div className="p-6 pb-3 border-b border-slate-800 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1">
              Select Class / Course
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1">
              Select Day of Week
            </label>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedDay === day
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Body: Periods List */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Periods for {selectedDay} ({periods.length})
              </h4>
              <button
                type="button"
                onClick={handleAddPeriod}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Period
              </button>
            </div>

            {loadingSchedule ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : periods.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                No periods configured for this day. Click{" "}
                <span className="text-indigo-400 font-bold">Add Period</span> to create the routine.
              </div>
            ) : (
              <div className="space-y-3">
                {periods.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center gap-3"
                  >
                    {/* Period Badge */}
                    <div className="flex items-center justify-between md:justify-start gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        #{p.periodNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 md:hidden">
                        Period #{p.periodNumber}
                      </span>
                    </div>

                    {/* Timings */}
                    <div className="grid grid-cols-2 gap-2 w-full md:w-56 flex-shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                          Start Time
                        </span>
                        <input
                          type="text"
                          required
                          value={p.startTime}
                          onChange={(e) => handlePeriodChange(idx, "startTime", e.target.value)}
                          placeholder="10:00 AM"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                          End Time
                        </span>
                        <input
                          type="text"
                          required
                          value={p.endTime}
                          onChange={(e) => handlePeriodChange(idx, "endTime", e.target.value)}
                          placeholder="11:00 AM"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Subject Selector */}
                    <div className="flex-1 w-full">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                        Subject
                      </span>
                      <select
                        required
                        value={p.subject}
                        onChange={(e) => handlePeriodChange(idx, "subject", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="">-- Choose Subject --</option>
                        {subjects.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name} ({sub.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Teacher Selector */}
                    <div className="w-full md:w-44 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                        Faculty
                      </span>
                      <select
                        value={p.teacher}
                        onChange={(e) => handlePeriodChange(idx, "teacher", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="">-- Faculty Assigned --</option>
                        {teachers.map((tch) => (
                          <option key={tch._id} value={tch._id}>
                            {tch.user?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Room No */}
                    <div className="w-full md:w-32 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                        Room / Lab
                      </span>
                      <input
                        type="text"
                        value={p.roomNo}
                        onChange={(e) => handlePeriodChange(idx, "roomNo", e.target.value)}
                        placeholder="Room 201"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Delete Period Button */}
                    <div className="self-end md:self-center pt-2 md:pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemovePeriod(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Period"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Save Button */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3 mt-6">
            <p className="text-[11px] text-slate-400">
              Changes apply directly to students and faculty routines for {selectedDay}.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || loadingSchedule}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Routine
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableModal;
