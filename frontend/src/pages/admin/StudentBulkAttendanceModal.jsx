import { useState, useEffect } from "react";
import { X, Loader2, Save, CalendarDays, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { getStudentDetailedReport } from "../../services/reportService.js";
import { overrideStudentAttendance } from "../../services/attendanceService.js";

const StudentBulkAttendanceModal = ({ isOpen, onClose, student }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentStats();
    }
  }, [isOpen, student]);

  const fetchStudentStats = async () => {
    setLoading(true);
    try {
      const data = await getStudentDetailedReport(student._id);
      
      const formSubjects = data.map((sub) => ({
        subjectId: sub.subjectId,
        subjectName: sub.subjectName,
        subjectCode: sub.subjectCode,
        totalConducted: sub.totalConducted || 0,
        totalAttended: sub.present || 0,
      }));

      setSubjects(formSubjects);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load student statistics");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newSubjects = [...subjects];
    const val = parseInt(value, 10) || 0;
    
    newSubjects[index][field] = val;

    if (field === "totalConducted" && newSubjects[index].totalAttended > val) {
      newSubjects[index].totalAttended = val;
    } else if (field === "totalAttended" && val > newSubjects[index].totalConducted) {
      newSubjects[index].totalConducted = val;
    }

    setSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0) {
      toast.error("No active subjects found for this student.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        studentId: student._id,
        classId: student.class?._id || student.class,
        subjects: subjects.map((sub) => ({
          subjectId: sub.subjectId,
          totalConducted: sub.totalConducted,
          totalAttended: sub.totalAttended,
        })),
      };

      await overrideStudentAttendance(payload);
      toast.success("Bulk attendance updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update attendance");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={!saving ? onClose : undefined} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-500" />
              Bulk Attendance Override
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Editing for <span className="font-semibold text-slate-700 dark:text-slate-300">{student?.user?.name || "Student"}</span> ({student?.rollNo})
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-6 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <strong>Warning:</strong> Submitting this form will completely wipe this student's day-to-day attendance history and generate mock past records to match these exact numbers.
          </p>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">Fetching student statistics...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400">No active subjects found for this student's class.</p>
            </div>
          ) : (
            <form id="bulk-attendance-form" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="col-span-6">Subject</div>
                  <div className="col-span-3 text-center">Total Conducted</div>
                  <div className="col-span-3 text-center">Total Attended</div>
                </div>

                {subjects.map((sub, idx) => (
                  <div key={sub.subjectId} className="grid grid-cols-12 gap-4 items-center py-2">
                    <div className="col-span-6">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {sub.subjectName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sub.subjectCode}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        value={sub.totalConducted}
                        onChange={(e) => handleInputChange(idx, "totalConducted", e.target.value)}
                        className="w-full text-center px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        max={sub.totalConducted}
                        value={sub.totalAttended}
                        onChange={(e) => handleInputChange(idx, "totalAttended", e.target.value)}
                        className="w-full text-center px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bulk-attendance-form"
            disabled={saving || loading || subjects.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Override"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBulkAttendanceModal;
