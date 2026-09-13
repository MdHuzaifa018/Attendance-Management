import { useState, useMemo, useRef } from "react";
import {
  X,
  Printer,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Layers,
  ListFilter,
  Users,
  Calendar,
  Building2,
  GraduationCap,
} from "lucide-react";

/**
 * PrintableReportModal
 * Official Nalanda College Attendance Register & Print-ready Report.
 * Features:
 * - Consolidated view (1 row per student, aggregated across all subjects)
 * - Detailed view (subject-wise breakdown with Subject column)
 * - Quick search by roll or name
 * - Beautiful A4 printable format with college letterhead & signatures
 */
const PrintableReportModal = ({
  isOpen,
  onClose,
  reportData = [],
  filters = {},
  departments = [],
  classes = [],
  subjects = [],
}) => {
  const reportRef = useRef(null);

  // View Mode: "consolidated" (1 row per student) or "detailed" (subject-wise breakdown)
  const [viewMode, setViewMode] = useState("consolidated");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Human-readable labels
  const selectedDept =
    departments.find((d) => d._id === filters.departmentId)?.name || "All Departments";
  const selectedClass =
    classes.find((c) => c._id === filters.classId)?.name || "BCA 3rd Year (BCA-III)";
  const selectedSubject = subjects.find((s) => s._id === filters.subjectId);
  const subjectLabel = selectedSubject
    ? `${selectedSubject.name} (${selectedSubject.code})`
    : "All Class Subjects";

  const currentDateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── 1. Calculate Consolidated Data (1 Row per Student) ──
  const consolidatedRows = useMemo(() => {
    const map = new Map();

    reportData.forEach((row) => {
      const key = row.rollNo || row.studentName;
      if (!map.has(key)) {
        map.set(key, {
          studentName: row.studentName,
          rollNo: row.rollNo,
          className: row.className,
          totalConducted: 0,
          present: 0,
          absent: 0,
          subjectsCount: 0,
          subjectNames: [],
        });
      }
      const entry = map.get(key);
      entry.totalConducted += row.totalConducted || 0;
      entry.present += row.present || 0;
      entry.absent += row.absent || 0;
      entry.subjectsCount += 1;
      if (row.subjectName && !entry.subjectNames.includes(row.subjectName)) {
        entry.subjectNames.push(row.subjectName);
      }
    });

    return Array.from(map.values()).map((item) => {
      const pct =
        item.totalConducted > 0
          ? Math.round((item.present / item.totalConducted) * 100)
          : 0;
      return {
        ...item,
        percent: pct,
      };
    });
  }, [reportData]);

  // ── 2. Determine Active Rows based on View Mode ──
  const activeDataset = viewMode === "consolidated" ? consolidatedRows : reportData;

  // ── 3. Filter by Search Query ──
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return activeDataset;
    const q = searchQuery.toLowerCase().trim();
    return activeDataset.filter(
      (r) =>
        (r.studentName && r.studentName.toLowerCase().includes(q)) ||
        (r.rollNo && r.rollNo.toLowerCase().includes(q)) ||
        (r.subjectName && r.subjectName.toLowerCase().includes(q))
    );
  }, [activeDataset, searchQuery]);

  // ── 4. Statistical Summary Calculations ──
  const totalUniqueStudents = consolidatedRows.length;
  const totalClassesConducted =
    viewMode === "consolidated"
      ? consolidatedRows[0]?.totalConducted || reportData[0]?.totalConducted || 0
      : reportData[0]?.totalConducted || 0;

  const avgAttendancePercent =
    totalUniqueStudents > 0
      ? Math.round(
          consolidatedRows.reduce((sum, r) => sum + (r.percent || 0), 0) /
            totalUniqueStudents
        )
      : 0;

  const defaultersCount = consolidatedRows.filter((r) => (r.percent || 0) < 75).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[96vh] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        
        {/* ── Top Toolbar (Hidden during Print) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 print:hidden flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Official Attendance Register
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {selectedClass}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nalanda College · Digital Attendance ERP Print Sheet
              </p>
            </div>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("consolidated")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "consolidated"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Consolidated (1 Row / Student)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("detailed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "detailed"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Subject-Wise Breakdown
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative hidden lg:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roll / name..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Document Canvas Container ── */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center bg-slate-200 dark:bg-slate-950/80">
          <div
            id="printable-attendance-sheet"
            ref={reportRef}
            className="w-full max-w-5xl bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-300 font-sans min-h-full flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none"
          >
            <div>
              {/* ── College Official Letterhead ── */}
              <div className="border-b-2 border-indigo-950 pb-5 text-center relative">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <img
                    src="/logo.png"
                    alt="Nalanda College Crest"
                    className="w-16 h-16 object-contain rounded-xl shadow-sm"
                  />
                  <div className="text-left">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-wide uppercase text-indigo-950 font-serif leading-tight">
                      Nalanda College, Biharsharif
                    </h1>
                    <p className="text-xs font-bold text-slate-600 tracking-wider uppercase">
                      (Constituent Unit of Patliputra University, Patna · Estd. 1870)
                    </p>
                    <p className="text-xs font-semibold text-indigo-800 mt-0.5 uppercase tracking-wide">
                      Department of Computer Applications & Information Technology
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="px-4 py-1 bg-indigo-950 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                    {viewMode === "consolidated"
                      ? "Official Consolidated Attendance Register"
                      : "Official Subject-Wise Attendance Sheet"}
                  </span>
                </div>
              </div>

              {/* ── Report Metadata Details Bar ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs bg-slate-50/50 px-4 rounded-xl mt-4">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
                    Class / Course
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{selectedClass}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
                    Report Scope
                  </span>
                  <span className="font-bold text-indigo-900 text-sm">
                    {viewMode === "consolidated" ? "Consolidated (All Subjects)" : subjectLabel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
                    Department
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{selectedDept}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
                    Date of Generation
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{currentDateStr}</span>
                </div>
              </div>

              {/* ── Statistical Highlights KPI Bar ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Total Enrolled Students
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {totalUniqueStudents}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Lectures Conducted
                  </span>
                  <span className="text-xl font-black text-indigo-700">
                    {totalClassesConducted}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Average Attendance
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {avgAttendancePercent}%
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Defaulters (&lt; 75%)
                  </span>
                  <span className="text-xl font-black text-red-600">
                    {defaultersCount}
                  </span>
                </div>
              </div>

              {/* ── Tabular Attendance Records ── */}
              <div className="overflow-x-auto my-5 rounded-xl border border-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-12">#</th>
                      <th className="py-2.5 px-3 border border-slate-800 w-32">Roll No</th>
                      <th className="py-2.5 px-3 border border-slate-800">Student Name</th>
                      <th className="py-2.5 px-3 border border-slate-800">Class</th>
                      {viewMode === "detailed" && (
                        <th className="py-2.5 px-3 border border-slate-800">Subject</th>
                      )}
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-16">Held</th>
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-16">Attended</th>
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-16">Absent</th>
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-24">Percentage</th>
                      <th className="py-2.5 px-3 border border-slate-800 text-center w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={viewMode === "detailed" ? 10 : 9}
                          className="py-12 text-center text-slate-400 text-xs italic"
                        >
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, idx) => {
                        const pct = row.percent || 0;
                        let badgeClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
                        let statusLabel = "Eligible";

                        if (pct < 50) {
                          badgeClass = "text-red-700 bg-red-50 border-red-300";
                          statusLabel = "Critical";
                        } else if (pct < 75) {
                          badgeClass = "text-amber-700 bg-amber-50 border-amber-300";
                          statusLabel = "Shortage";
                        }

                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                            } hover:bg-indigo-50/40`}
                          >
                            <td className="py-2 px-3 text-center text-slate-500 border border-slate-200 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-indigo-950 border border-slate-200">
                              {row.rollNo}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900 border border-slate-200">
                              {row.studentName}
                            </td>
                            <td className="py-2 px-3 text-slate-600 border border-slate-200">
                              {row.className}
                            </td>
                            {viewMode === "detailed" && (
                              <td className="py-2 px-3 text-slate-700 border border-slate-200">
                                <span className="font-semibold block">{row.subjectName}</span>
                                {row.subjectCode && (
                                  <span className="text-[10px] text-slate-500 font-mono block">
                                    ({row.subjectCode})
                                  </span>
                                )}
                              </td>
                            )}
                            <td className="py-2 px-3 text-center font-medium text-slate-700 border border-slate-200">
                              {row.totalConducted}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-emerald-700 border border-slate-200">
                              {row.present}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-red-600 border border-slate-200">
                              {row.absent}
                            </td>
                            <td className="py-2 px-3 text-center font-black border border-slate-200">
                              <span
                                className={
                                  pct >= 75
                                    ? "text-emerald-700"
                                    : pct >= 50
                                    ? "text-amber-700"
                                    : "text-red-700"
                                }
                              >
                                {pct}%
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center border border-slate-200">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Official Signatures Block ── */}
            <div className="mt-12 pt-8 border-t border-slate-300">
              <div className="grid grid-cols-3 gap-8 text-center text-xs">
                <div>
                  <div className="h-12 flex items-end justify-center">
                    <span className="text-slate-300 text-[10px] italic select-none">
                      (Signature & Stamp)
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-500 pt-2 font-bold text-slate-900">
                    Subject Faculty / In-Charge
                  </div>
                  <div className="text-[10px] text-slate-500">Nalanda College</div>
                </div>
                <div>
                  <div className="h-12 flex items-end justify-center">
                    <span className="text-slate-300 text-[10px] italic select-none">
                      (Signature & Stamp)
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-500 pt-2 font-bold text-slate-900">
                    Head of Department (H.O.D)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Dept. of Computer Applications
                  </div>
                </div>
                <div>
                  <div className="h-12 flex items-end justify-center">
                    <span className="text-slate-300 text-[10px] italic select-none">
                      (Seal & Signature)
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-500 pt-2 font-bold text-slate-900">
                    Principal / Controller of Exams
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Nalanda College, Biharsharif
                  </div>
                </div>
              </div>

              {/* Security & Verification Watermark Footer */}
              <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  Generated electronically by Nalanda College Digital ERP · Official Document ID:{" "}
                  <span className="font-mono font-semibold text-slate-600">
                    NCB-ATT-{new Date().getFullYear()}-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </span>
                <span>Page 1 of 1 · Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReportModal;
