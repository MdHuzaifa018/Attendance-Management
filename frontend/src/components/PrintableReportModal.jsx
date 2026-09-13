import { useRef } from "react";
import { X, Printer, FileText, CheckCircle2, AlertTriangle, AlertCircle, Building2, Calendar, Award } from "lucide-react";

/**
 * PrintableReportModal
 * Generates an official, print-ready attendance register report with Nalanda College letterhead.
 */
const PrintableReportModal = ({ isOpen, onClose, reportData, filters, departments, classes, subjects }) => {
  const reportRef = useRef(null);

  if (!isOpen) return null;

  // Derive human-readable filter details
  const selectedDept = departments.find((d) => d._id === filters.departmentId)?.name || "All Departments";
  const selectedClass = classes.find((c) => c._id === filters.classId)?.name || "BCA 3rd Year (BCA-III)";
  const selectedSubject = subjects.find((s) => s._id === filters.subjectId);
  const subjectLabel = selectedSubject ? `${selectedSubject.name} (${selectedSubject.code})` : "All Class Subjects";

  // Calculations
  const totalStudents = reportData.length;
  const totalConducted = reportData[0]?.totalConducted || 0;
  const avgPercent =
    totalStudents > 0
      ? Math.round(reportData.reduce((acc, row) => acc + (row.percent || 0), 0) / totalStudents)
      : 0;
  const defaultersCount = reportData.filter((r) => (r.percent || 0) < 75).length;

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col my-8 max-h-[90vh] text-slate-900 dark:text-white">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              Official Printable Attendance Sheet
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-6 md:p-8 overflow-y-auto flex justify-center bg-slate-100/70 dark:bg-slate-950/40">
          <div
            id="printable-attendance-sheet"
            ref={reportRef}
            className="w-full bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:p-0 print:border-none print:shadow-none print:m-0 font-sans"
          >
            {/* ── College Official Header ── */}
            <div className="border-b-2 border-indigo-900 pb-4 text-center relative">
              <div className="flex items-center justify-center gap-3 mb-1">
                <img
                  src="/logo.png"
                  alt="Nalanda College Official Logo"
                  className="w-14 h-14 object-contain rounded-xl shadow-sm"
                />
                <div>
                  <h1 className="text-2xl font-black tracking-wider uppercase text-indigo-950 font-serif">
                    Nalanda College, Biharsharif
                  </h1>
                  <p className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                    (Constituent Unit of Patliputra University, Patna · Estd. 1870)
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-indigo-800 mt-1 uppercase tracking-wider">
                Department of Computer Applications & Information Technology
              </p>
              <div className="mt-2 inline-block px-4 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-bold text-indigo-900 uppercase tracking-widest">
                Official Consolidated Attendance Register
              </div>
            </div>

            {/* ── Report Metadata Details ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Class / Course</span>
                <span className="font-bold text-slate-900">{selectedClass}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Subject</span>
                <span className="font-bold text-slate-900">{subjectLabel}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Department</span>
                <span className="font-bold text-slate-900">{selectedDept}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Date of Issue</span>
                <span className="font-bold text-slate-900">{currentDateStr}</span>
              </div>
            </div>

            {/* ── Statistical Highlights Bar ── */}
            <div className="grid grid-cols-4 gap-3 my-4">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Students</span>
                <span className="text-lg font-black text-slate-800">{totalStudents}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Classes Conducted</span>
                <span className="text-lg font-black text-indigo-700">{totalConducted}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Average Attendance</span>
                <span className="text-lg font-black text-emerald-600">{avgPercent}%</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Defaulters (&lt; 75%)</span>
                <span className="text-lg font-black text-red-600">{defaultersCount}</span>
              </div>
            </div>

            {/* ── Tabular Attendance Records ── */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead>
                  <tr className="bg-indigo-950 text-white font-semibold">
                    <th className="py-2 px-3 border border-indigo-900">Roll No</th>
                    <th className="py-2 px-3 border border-indigo-900">Student Name</th>
                    <th className="py-2 px-3 border border-indigo-900">Class</th>
                    <th className="py-2 px-3 border border-indigo-900 text-center">Held</th>
                    <th className="py-2 px-3 border border-indigo-900 text-center">Attended</th>
                    <th className="py-2 px-3 border border-indigo-900 text-center">Absent</th>
                    <th className="py-2 px-3 border border-indigo-900 text-center">Percentage</th>
                    <th className="py-2 px-3 border border-indigo-900 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportData.map((row, idx) => {
                    const pct = row.percent || 0;
                    let badgeClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
                    let statusLabel = "Eligible";

                    if (pct < 50) {
                      badgeClass = "text-red-700 bg-red-50 border-red-300";
                      statusLabel = "Critical";
                    } else if (pct < 75) {
                      badgeClass = "text-amber-700 bg-amber-50 border-amber-300";
                      statusLabel = "Warning";
                    }

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-950 border border-slate-200">
                          {row.rollNo}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 border border-slate-200">
                          {row.studentName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border border-slate-200">
                          {row.className}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-700 border border-slate-200">
                          {row.totalConducted}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-700 border border-slate-200">
                          {row.present}
                        </td>
                        <td className="py-2 px-3 text-center text-red-600 border border-slate-200">
                          {row.absent}
                        </td>
                        <td className="py-2 px-3 text-center font-black border border-slate-200">
                          {pct}%
                        </td>
                        <td className="py-2 px-3 text-center border border-slate-200">
                          <span
                            className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${badgeClass}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Official Signatures Block ── */}
            <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs">
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                  Subject Faculty Signature
                </div>
                <div className="text-[10px] text-slate-500">Teacher In-Charge</div>
              </div>
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                  Head of Department (H.O.D)
                </div>
                <div className="text-[10px] text-slate-500">Dept. of Computer Applications</div>
              </div>
              <div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                  Principal / Vice-Chancellor
                </div>
                <div className="text-[10px] text-slate-500">Nalanda College, Biharsharif</div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2">
              Generated automatically by Nalanda College Digital Attendance ERP. For verification, contact Principal Office.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReportModal;
