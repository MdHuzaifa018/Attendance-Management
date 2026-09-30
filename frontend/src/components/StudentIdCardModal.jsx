import { useState, useEffect, useRef } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  GraduationCap,
  Upload,
  Camera,
  Trash2,
  Save,
  Loader2,
  Palette,
  Edit3,
  Eye,
  CheckCircle2,
  User,
  HeartHandshake,
  QrCode,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { updateStudent } from "../services/studentService.js";
import { useAuth } from "../context/AuthContext.jsx";

// Color Themes for ID Card
const THEMES = {
  navy: {
    id: "navy",
    name: "Royal Navy & Indigo",
    gradient: "from-slate-900 via-slate-900 to-indigo-950/95",
    border: "border-indigo-500/40",
    printBorder: "print:border-indigo-600",
    accentText: "text-indigo-300",
    pill: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40",
    photoBorder: "border-indigo-400/50",
    photoBg: "from-indigo-950 to-slate-900",
    divider: "border-indigo-500/30",
    rollBadge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    signBorder: "border-indigo-400/50",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Prestige",
    gradient: "from-slate-900 via-slate-900 to-emerald-950/95",
    border: "border-emerald-500/40",
    printBorder: "print:border-emerald-600",
    accentText: "text-emerald-300",
    pill: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
    photoBorder: "border-emerald-400/50",
    photoBg: "from-emerald-950 to-slate-900",
    divider: "border-emerald-500/30",
    rollBadge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    signBorder: "border-emerald-400/50",
  },
  burgundy: {
    id: "burgundy",
    name: "Imperial Crimson",
    gradient: "from-slate-900 via-slate-900 to-rose-950/95",
    border: "border-rose-500/40",
    printBorder: "print:border-rose-600",
    accentText: "text-rose-300",
    pill: "bg-rose-500/20 text-rose-200 border-rose-500/40",
    photoBorder: "border-rose-400/50",
    photoBg: "from-rose-950 to-slate-900",
    divider: "border-rose-500/30",
    rollBadge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    signBorder: "border-rose-400/50",
  },
  onyx: {
    id: "onyx",
    name: "Midnight Onyx & Gold",
    gradient: "from-slate-950 via-slate-900 to-slate-950",
    border: "border-amber-500/40",
    printBorder: "print:border-amber-600",
    accentText: "text-amber-300",
    pill: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    photoBorder: "border-amber-400/50",
    photoBg: "from-slate-900 to-slate-950",
    divider: "border-amber-500/30",
    rollBadge: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    signBorder: "border-amber-400/50",
  },
};

// Helper: Compress uploaded image to lightweight Base64 DataURL
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * StudentIdCardModal (ID Card Studio)
 * Allows Admin to generate, edit, upload/update photo, customize, and print Student Identity Cards.
 */
const StudentIdCardModal = ({
  isOpen,
  onClose,
  student,
  studentsList = [],
  onUpdateSuccess,
}) => {
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  // Active view tab on smaller viewports: "preview" or "edit"
  const [activeTab, setActiveTab] = useState("preview");
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("navy");

  // Editable Card Data State
  const [cardData, setCardData] = useState({
    studentId: "",
    studentName: "",
    rollNo: "",
    fatherName: "",
    className: "",
    deptName: "",
    duration: "2024-27",
    phone: "",
    bloodGroup: "O+",
    photo: "",
    collegeName: "NALANDA COLLEGE",
    collegeSubtitle: "BIHARSHARIF · ESTD. 1870 (PPU AFFILIATED)",
    signatoryTitle: "Principal",
  });

  // Load student data into state whenever student prop changes
  useEffect(() => {
    if (student) {
      setCardData({
        studentId: student._id || "",
        studentName: student.user?.name || student.name || "",
        rollNo: student.rollNo || "",
        fatherName: student.fatherName || "",
        className: student.class?.name || student.class?.code || "BCA Third Year",
        deptName: student.department?.name || student.department?.code || "Computer Applications",
        duration: student.duration || `${student.admissionYear || 2024}-27`,
        phone: student.phone || "",
        bloodGroup: student.bloodGroup || "O+",
        photo: student.photo || "",
        collegeName: "NALANDA COLLEGE",
        collegeSubtitle: "BIHARSHARIF · ESTD. 1870 (PPU AFFILIATED)",
        signatoryTitle: "Principal",
      });
    } else {
      // Default blank template for new card creation
      setCardData({
        studentId: "",
        studentName: "Student Name",
        rollNo: "BCA-001",
        fatherName: "Father's Name",
        className: "BCA First Year",
        deptName: "Bachelor of Computer Applications",
        duration: "2024-27",
        phone: "+91 9876543210",
        bloodGroup: "O+",
        photo: "",
        collegeName: "NALANDA COLLEGE",
        collegeSubtitle: "BIHARSHARIF · ESTD. 1870 (PPU AFFILIATED)",
        signatoryTitle: "Principal",
      });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }

    try {
      const base64Photo = await compressImage(file);
      setCardData((prev) => ({ ...prev, photo: base64Photo }));
      toast.success("Photo attached to ID Card!");
    } catch {
      toast.error("Failed to process photo");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setCardData((prev) => ({ ...prev, photo: "" }));
    toast.success("Photo removed");
  };

  // Save changes to database (if editing an existing registered student)
  const handleSaveToProfile = async () => {
    if (!cardData.studentId) {
      toast("Custom card details ready for print! (Not linked to existing profile)", {
        icon: "ℹ️",
      });
      return;
    }

    setSaving(true);
    try {
      await updateStudent(cardData.studentId, {
        name: cardData.studentName,
        fatherName: cardData.fatherName,
        rollNo: cardData.rollNo,
        phone: cardData.phone,
        duration: cardData.duration,
        photo: cardData.photo,
        bloodGroup: cardData.bloodGroup,
      });

      toast.success("Student profile & ID card updated in database!");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save student profile");
    } finally {
      setSaving(false);
    }
  };

  // Print ID Card
  const handlePrint = () => {
    window.print();
  };

  // Switch to another student if list provided
  const handleSelectStudent = (studentId) => {
    const found = studentsList.find((s) => s._id === studentId);
    if (found) {
      setCardData({
        studentId: found._id,
        studentName: found.user?.name || found.name || "",
        rollNo: found.rollNo || "",
        fatherName: found.fatherName || "",
        className: found.class?.name || found.class?.code || "BCA-I",
        deptName: found.department?.name || found.department?.code || "Computer Applications",
        duration: found.duration || `${found.admissionYear || 2024}-27`,
        phone: found.phone || "",
        bloodGroup: found.bloodGroup || "O+",
        photo: found.photo || "",
        collegeName: "NALANDA COLLEGE",
        collegeSubtitle: "BIHARSHARIF · ESTD. 1870 (PPU AFFILIATED)",
        signatoryTitle: "Principal",
      });
      toast.success(`Loaded ${found.user?.name || found.rollNo}`);
    }
  };

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const theme = THEMES[selectedTheme] || THEMES.navy;

  // Student non-admin view: simple preview & print modal
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                Official Student Identity Card
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
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

          <div className="p-6 flex items-center justify-center bg-slate-100/70 dark:bg-slate-950/40">
            <div
              id="printable-student-id-card"
              ref={cardRef}
              className={`w-[380px] bg-gradient-to-b ${theme.gradient} border-2 ${theme.border} rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white font-sans ${theme.printBorder} print:m-0 print:shadow-none`}
            >
              <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none text-white">
                <GraduationCap className="w-full h-full" />
              </div>

              <div className={`text-center pb-3 border-b ${theme.divider} relative`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-contain bg-white/95 p-0.5 shadow-md"
                  />
                  <div>
                    <h2 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                      {cardData.collegeName}
                    </h2>
                    <p className={`text-[9px] font-semibold ${theme.accentText} tracking-tight uppercase`}>
                      {cardData.collegeSubtitle}
                    </p>
                  </div>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mt-0.5 ${theme.pill}`}>
                  IDENTITY CARD
                </div>
              </div>

              <div className="mt-4 flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-20 h-24 rounded-xl border-2 ${theme.photoBorder} bg-gradient-to-b ${theme.photoBg} flex flex-col items-center justify-center shadow-inner overflow-hidden relative`}>
                    {cardData.photo ? (
                      <img src={cardData.photo} alt={cardData.studentName} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className={`w-12 h-12 rounded-full ${theme.pill} flex items-center justify-center font-bold text-lg mb-1`}>
                          {(cardData.studentName || "S").charAt(0)}
                        </div>
                        <span className="text-[8px] font-semibold text-slate-400">PHOTO</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme.rollBadge}`}>
                      #{cardData.rollNo || "000"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-xs min-w-0">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Student Name</p>
                    <p className="text-xs font-bold text-white tracking-wide truncate">{cardData.studentName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Father's Name</p>
                    <p className="text-[11px] font-medium text-slate-200 truncate">{cardData.fatherName || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Class</p>
                      <p className={`text-[11px] font-semibold ${theme.accentText} truncate`}>{cardData.className || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Session</p>
                      <p className="text-[11px] font-semibold text-emerald-400">{cardData.duration || "2024-27"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Department</p>
                    <p className="text-[10px] text-slate-300 font-medium truncate">{cardData.deptName || "—"}</p>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t ${theme.divider} flex items-end justify-between`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-[2px] h-6 px-1.5 bg-white/95 rounded py-0.5">
                    {[4, 2, 6, 1, 3, 5, 2, 4, 1, 5, 3, 2, 6, 2, 4, 1, 3, 5, 2, 4].map((h, i) => (
                      <div key={i} className="bg-black" style={{ width: i % 3 === 0 ? "2px" : "1px", height: `${h * 3}px` }} />
                    ))}
                  </div>
                  <p className="text-[8px] font-mono text-slate-400 tracking-widest text-center uppercase">
                    NC-ID-{cardData.rollNo || "000"}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`h-5 flex items-center justify-center font-serif italic text-[11px] ${theme.accentText}`}>
                    {cardData.signatoryTitle || "Principal"}
                  </div>
                  <div className={`w-20 border-t ${theme.signBorder} pt-0.5`}>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Authorized Sign</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view: full ID Card Studio with live editing, photo upload, theme selection
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {/* Studio Dialog Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white my-auto max-h-[92vh]">
        
        {/* ── Top Bar (Hidden during print) ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Official Student Identity Card Studio
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  CR80 HD
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Live editor, instant photo uploader, and high-resolution print generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher on mobile/tablet */}
            <div className="flex lg:hidden bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  activeTab === "edit"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Main Studio Body: Editor (Left) & Preview (Right) ─────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-100/70 dark:bg-slate-950/40">
          
          {/* ── LEFT PANE: Editor Controls (Hidden on mobile if tab === "preview") */}
          <div
            className={`lg:col-span-6 space-y-4 print:hidden ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Quick Student Switcher if multiple students available */}
            {studentsList.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select Enrolled Student
                </label>
                <select
                  value={cardData.studentId}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose student to populate data --</option>
                  {studentsList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.rollNo} — {s.user?.name} ({s.class?.name || s.class?.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Photo Upload & Management Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-500" />
                Student Photograph
              </h4>

              <div className="flex items-center gap-4">
                {/* Photo Preview Thumbnail */}
                <div className="w-16 h-20 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {cardData.photo ? (
                    <img
                      src={cardData.photo}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <User className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-[9px] text-slate-400 block mt-1 font-semibold">
                        No Photo
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Buttons */}
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </button>

                    {cardData.photo && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP. Auto-formatted for official ID card standard.
                  </p>
                </div>
              </div>
            </div>

            {/* Student Metadata Form Fields */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-indigo-500" />
                Identity Card Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Student Name */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={cardData.studentName}
                    onChange={(e) =>
                      setCardData({ ...cardData, studentName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Murlidhar Yadav"
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={cardData.fatherName}
                    onChange={(e) =>
                      setCardData({ ...cardData, fatherName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Upendra Yadav"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Roll / Card Number *
                  </label>
                  <input
                    type="text"
                    value={cardData.rollNo}
                    onChange={(e) =>
                      setCardData({ ...cardData, rollNo: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. BCA-III-001"
                  />
                </div>

                {/* Academic Class */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Class / Year
                  </label>
                  <input
                    type="text"
                    value={cardData.className}
                    onChange={(e) =>
                      setCardData({ ...cardData, className: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. BCA Third Year"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={cardData.deptName}
                    onChange={(e) =>
                      setCardData({ ...cardData, deptName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Bachelor of Computer Applications"
                  />
                </div>

                {/* Academic Session */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Session Duration
                  </label>
                  <input
                    type="text"
                    value={cardData.duration}
                    onChange={(e) =>
                      setCardData({ ...cardData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 2024-27"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Blood Group
                  </label>
                  <select
                    value={cardData.bloodGroup}
                    onChange={(e) =>
                      setCardData({ ...cardData, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "N/A"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Phone / Emergency Contact */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={cardData.phone}
                    onChange={(e) =>
                      setCardData({ ...cardData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Card Theme Picker */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-500" />
                Color Theme & Palette
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSelectedTheme(th.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTheme === th.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className={`w-full h-3 rounded-md bg-gradient-to-r ${th.gradient} mb-1.5`} />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                      {th.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save to Student Profile Button */}
            {cardData.studentId && (
              <button
                type="button"
                onClick={handleSaveToProfile}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes to Database...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Details & Photo to Student Profile
                  </>
                )}
              </button>
            )}
          </div>

          {/* ── RIGHT PANE: Live Print-Ready ID Card Preview ─────────────────── */}
          <div
            className={`lg:col-span-6 flex flex-col items-center justify-center space-y-4 ${
              activeTab === "edit" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="w-full flex items-center justify-between px-2 text-xs font-semibold text-slate-500 print:hidden">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Live Card Preview
              </span>
              <span>Standard CR-80 Format</span>
            </div>

            {/* ── The Physical ID Card Card Container ───────────────────────── */}
            <div
              id="printable-student-id-card"
              ref={cardRef}
              className={`w-[380px] bg-gradient-to-b ${theme.gradient} border-2 ${theme.border} rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white font-sans ${theme.printBorder} print:m-0 print:shadow-none`}
            >
              {/* Background watermark crest decoration */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none text-white">
                <GraduationCap className="w-full h-full" />
              </div>

              {/* Header / College Branding */}
              <div className={`text-center pb-3 border-b ${theme.divider} relative`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-contain bg-white/95 p-0.5 shadow-md"
                  />
                  <div>
                    <h2 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                      {cardData.collegeName}
                    </h2>
                    <p className={`text-[9px] font-semibold ${theme.accentText} tracking-tight uppercase`}>
                      {cardData.collegeSubtitle}
                    </p>
                  </div>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mt-0.5 ${theme.pill}`}>
                  IDENTITY CARD
                </div>
              </div>

              {/* Body Info */}
              <div className="mt-4 flex gap-4 items-start">
                {/* Photo Box */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-20 h-24 rounded-xl border-2 ${theme.photoBorder} bg-gradient-to-b ${theme.photoBg} flex flex-col items-center justify-center shadow-inner overflow-hidden relative`}>
                    {cardData.photo ? (
                      <img
                        src={cardData.photo}
                        alt={cardData.studentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className={`w-12 h-12 rounded-full ${theme.pill} flex items-center justify-center font-bold text-lg mb-1`}>
                          {(cardData.studentName || "S").charAt(0)}
                        </div>
                        <span className="text-[8px] font-semibold text-slate-400">PHOTO</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 text-center">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme.rollBadge}`}>
                      #{cardData.rollNo || "000"}
                    </span>
                  </div>
                </div>

                {/* Student Metadata Table */}
                <div className="flex-1 space-y-1.5 text-xs min-w-0">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Student Name
                    </p>
                    <p className="text-xs font-bold text-white tracking-wide truncate">
                      {cardData.studentName || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Father's Name
                    </p>
                    <p className="text-[11px] font-medium text-slate-200 truncate">
                      {cardData.fatherName || "—"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        Class
                      </p>
                      <p className={`text-[11px] font-semibold ${theme.accentText} truncate`}>
                        {cardData.className || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        Session
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-400">
                        {cardData.duration || "2024-27"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Department
                    </p>
                    <p className="text-[10px] text-slate-300 font-medium truncate">
                      {cardData.deptName || "—"}
                    </p>
                  </div>

                  {/* Blood Group & Emergency row */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {cardData.bloodGroup && (
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                          Blood Group
                        </p>
                        <p className="text-[10px] font-bold text-rose-400">
                          {cardData.bloodGroup}
                        </p>
                      </div>
                    )}
                    {cardData.phone && (
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                          Contact
                        </p>
                        <p className="text-[10px] font-mono text-slate-300 truncate">
                          {cardData.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Simulated Barcode & Signatures Footer */}
              <div className={`mt-4 pt-3 border-t ${theme.divider} flex items-end justify-between`}>
                {/* Barcode representation */}
                <div className="space-y-1">
                  <div className="flex items-center gap-[2px] h-6 px-1.5 bg-white/95 rounded py-0.5">
                    {[4, 2, 6, 1, 3, 5, 2, 4, 1, 5, 3, 2, 6, 2, 4, 1, 3, 5, 2, 4].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: i % 3 === 0 ? "2px" : "1px",
                            height: `${h * 3}px`,
                          }}
                        />
                      )
                    )}
                  </div>
                  <p className="text-[8px] font-mono text-slate-400 tracking-widest text-center uppercase">
                    NC-ID-{cardData.rollNo || "000"}
                  </p>
                </div>

                {/* Signature stamp */}
                <div className="text-center">
                  <div className={`h-5 flex items-center justify-center font-serif italic text-[11px] ${theme.accentText}`}>
                    {cardData.signatoryTitle || "Principal"}
                  </div>
                  <div className={`w-20 border-t ${theme.signBorder} pt-0.5`}>
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                      Authorized Sign
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick helper tip */}
            <p className="text-[11px] text-slate-400 text-center print:hidden">
              💡 Click <strong className="text-indigo-500">Print / Save PDF</strong> to generate official credit-card size hard copies.
            </p>
          </div>
        </div>

        {/* ── Modal Footer ─────────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden shrink-0">
          <div className="text-xs text-slate-500">
            {cardData.studentId ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Linked to Student Profile
              </span>
            ) : (
              <span>Stand-alone Identity Card Generation</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCardModal;
