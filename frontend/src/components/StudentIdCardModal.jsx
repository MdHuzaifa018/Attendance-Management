import { useRef } from "react";
import { X, Printer, ShieldCheck, GraduationCap, Building2, Calendar, Phone, User, Award } from "lucide-react";

/**
 * StudentIdCardModal
 * Provides an official, print-ready Student Identity Card for Nalanda College.
 * Supports native browser printing with crisp layout formatting.
 */
const StudentIdCardModal = ({ isOpen, onClose, student }) => {
  const cardRef = useRef(null);

  if (!isOpen || !student) return null;

  const studentName = student.user?.name || student.name || "Student Name";
  const rollNo = student.rollNo || "N/A";
  const fatherName = student.fatherName || "—";
  const className = student.class?.name || student.class?.code || "BCA-III";
  const deptName = student.department?.name || student.department?.code || "Computer Applications";
  const duration = student.duration || `${student.admissionYear || 2024}-27`;
  const phone = student.phone || "—";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Modal Top Bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">Official Student Identity Card</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex items-center justify-center bg-slate-100/70 dark:bg-slate-950/40">
          <div
            id="printable-student-id-card"
            ref={cardRef}
            className="w-[380px] bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/90 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white font-sans print:m-0 print:shadow-none print:border-indigo-600"
          >
            {/* Background watermark crest decoration */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none text-indigo-400">
              <GraduationCap className="w-full h-full" />
            </div>

            {/* Header / College Branding */}
            <div className="text-center pb-3 border-b border-indigo-500/30 relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src="/logo.png"
                  alt="Nalanda College Logo"
                  className="w-8 h-8 rounded-full object-contain bg-white/95 p-0.5 shadow-md"
                />
                <div>
                  <h2 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                    Nalanda College
                  </h2>
                  <p className="text-[9px] font-semibold text-indigo-300 tracking-tight uppercase">
                    Biharsharif · Estd. 1870 (PPU Affiliated)
                  </p>
                </div>
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-0.5">
                Identity Card
              </div>
            </div>

            {/* Body Info */}
            <div className="mt-4 flex gap-4 items-start">
              {/* Photo Box */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-24 rounded-xl border-2 border-indigo-400/50 bg-gradient-to-b from-indigo-950 to-slate-900 flex flex-col items-center justify-center shadow-inner overflow-hidden relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-200 font-bold text-lg mb-1">
                    {studentName.charAt(0)}
                  </div>
                  <span className="text-[8px] font-semibold text-slate-400">PHOTO</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    #{rollNo}
                  </span>
                </div>
              </div>

              {/* Student Metadata Table */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Student Name</p>
                  <p className="text-xs font-bold text-white tracking-wide">{studentName}</p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Father's Name</p>
                  <p className="text-[11px] font-medium text-slate-200">{fatherName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Class</p>
                    <p className="text-[11px] font-semibold text-indigo-300">{className}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Session</p>
                    <p className="text-[11px] font-semibold text-emerald-400">{duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Department</p>
                  <p className="text-[10px] text-slate-300 font-medium">{deptName}</p>
                </div>
              </div>
            </div>

            {/* Simulated Barcode & Signatures Footer */}
            <div className="mt-4 pt-3 border-t border-indigo-500/30 flex items-end justify-between">
              {/* Barcode representation */}
              <div className="space-y-1">
                <div className="flex items-center gap-[2px] h-6 px-1 bg-white/90 rounded py-0.5">
                  {[4, 2, 6, 1, 3, 5, 2, 4, 1, 5, 3, 2, 6, 2, 4, 1, 3, 5].map((h, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: i % 3 === 0 ? "2px" : "1px",
                        height: `${h * 3}px`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-[8px] font-mono text-slate-400 tracking-widest text-center">
                  NC-BCA-{rollNo}
                </p>
              </div>

              {/* Signature stamp */}
              <div className="text-center">
                <div className="h-5 flex items-center justify-center font-serif italic text-[11px] text-indigo-300">
                  Principal
                </div>
                <div className="w-20 border-t border-indigo-400/50 pt-0.5">
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                    Authorized Sign
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer helper */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400 print:hidden">
          💡 Click <span className="text-indigo-400 font-semibold">Print / Save PDF</span> to generate an official hard copy or PDF.
        </div>
      </div>
    </div>
  );
};

export default StudentIdCardModal;
