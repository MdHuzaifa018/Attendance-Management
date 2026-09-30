import { useState, useEffect, useRef } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  Upload,
  Camera,
  Trash2,
  Save,
  Loader2,
  Edit3,
  Eye,
  CheckCircle2,
  User,
  Sparkles,
  PenTool,
  FileSignature,
} from "lucide-react";
import toast from "react-hot-toast";
import { updateStudent } from "../services/studentService.js";
import { useAuth } from "../context/AuthContext.jsx";

// Helper: Compress uploaded image or signature to lightweight Base64 DataURL
const compressImage = (file, maxWidth = 400, maxHeight = 500) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG format for transparent signatures if uploaded, else JPEG
        const format = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(format, 0.88));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * StudentIdCardModal
 * Authentic Nalanda College Student Identity Card matching the physical college card.
 * Supports:
 * - Admin Full Control: Edit all details, upload student photo, upload student & principal signatures, save to database.
 * - 100% Reliable Print: Uses isolated iframe print engine so ONLY the ID card prints cleanly!
 */
const StudentIdCardModal = ({
  isOpen,
  onClose,
  student,
  studentsList = [],
  onUpdateSuccess,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const cardRef = useRef(null);
  const fileInputRef = useRef(null);
  const studentSignInputRef = useRef(null);
  const directorSignInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("preview");
  const [saving, setSaving] = useState(false);

  // Card Data State matching Nalanda College Physical ID Card
  const [cardData, setCardData] = useState({
    studentId: "",
    studentName: "MD HUZAIFA",
    fatherName: "MD CHAND",
    motherName: "ZEENAT KAUSAR",
    dob: "09/12/2005",
    className: "BCA",
    rollNo: "14",
    idCardNo: "NC/MCA/24/14",
    aadharNo: "3696 1865 6211",
    address: "BADI DARGAH , PO+PS- BIHARSHARIF, NALANDA 803101",
    phone: "8340502099",
    duration: "2024-27",
    department: "Department of BCA",
    bloodGroup: "O+",
    photo: "",
    signature: "",
    directorSignature: "",
    directorTitle: "Sign. of Director",
    collegeName: "NALANDA COLLEGE",
    affilText: "(A Constituent Unit of Patliputra University, Patna)",
    locationText: "Biharsharif, Nalanda- 803101 (Bihar)",
    estdText: "Estd. 1870",
    motto: "Your Success is our Mission.",
  });

  // Load student data into state whenever student prop changes
  useEffect(() => {
    const savedCollegeDirectorSign =
      typeof window !== "undefined"
        ? localStorage.getItem("nalanda_director_sign") || ""
        : "";

    if (student) {
      const sName = student.user?.name || student.name || "Student Name";
      const sRoll = student.rollNo || "01";
      const sClass = student.class?.name || student.class?.code || "BCA";
      const sDept = student.department?.name
        ? `Department of ${student.department.code || student.department.name}`
        : "Department of BCA";
      const sDuration = student.duration || `${student.admissionYear || 2024}-27`;

      // Form default ID card number format: NC/[CLASS]/[YEAR]/[ROLL]
      const yearShort = (student.admissionYear ? String(student.admissionYear).slice(-2) : "24");
      const defaultIdNo = student.idCardNo || `NC/${sClass}/${yearShort}/${sRoll}`;

      setCardData({
        studentId: student._id || "",
        studentName: sName,
        fatherName: student.fatherName || "Father's Name",
        motherName: student.motherName || "Mother's Name",
        dob: student.dob || "01/01/2005",
        className: sClass,
        rollNo: sRoll,
        idCardNo: defaultIdNo,
        aadharNo: student.aadharNo || "XXXX XXXX XXXX",
        address: student.address || "Biharsharif, Nalanda 803101",
        phone: student.phone || "9876543210",
        duration: sDuration,
        department: sDept,
        bloodGroup: student.bloodGroup || "O+",
        photo: student.photo || "",
        signature: student.signature || "",
        directorSignature: student.directorSignature || savedCollegeDirectorSign || "",
        directorTitle: student.directorTitle || "Sign. of Director",
        collegeName: "NALANDA COLLEGE",
        affilText: "(A Constituent Unit of Patliputra University, Patna)",
        locationText: "Biharsharif, Nalanda- 803101 (Bihar)",
        estdText: "Estd. 1870",
        motto: "Your Success is our Mission.",
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
      const base64Photo = await compressImage(file, 400, 500);
      setCardData((prev) => ({ ...prev, photo: base64Photo }));
      toast.success("Photo updated on ID card!");
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

  // Handle Student Signature Upload
  const handleStudentSignUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG)");
      return;
    }

    try {
      const base64Sign = await compressImage(file, 350, 150);
      setCardData((prev) => ({ ...prev, signature: base64Sign }));
      toast.success("Student signature added to ID card!");
    } catch {
      toast.error("Failed to process signature");
    } finally {
      if (studentSignInputRef.current) studentSignInputRef.current.value = "";
    }
  };

  const handleRemoveStudentSign = () => {
    setCardData((prev) => ({ ...prev, signature: "" }));
    toast.success("Student signature removed");
  };

  // Handle Principal / Director Signature Upload
  const handleDirectorSignUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG)");
      return;
    }

    try {
      const base64Sign = await compressImage(file, 350, 150);
      setCardData((prev) => ({ ...prev, directorSignature: base64Sign }));
      // Save in localStorage as college default for subsequent ID cards
      try {
        localStorage.setItem("nalanda_director_sign", base64Sign);
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
      toast.success("Principal / Director signature updated college-wide!");
    } catch {
      toast.error("Failed to process signature");
    } finally {
      if (directorSignInputRef.current) directorSignInputRef.current.value = "";
    }
  };

  const handleRemoveDirectorSign = () => {
    setCardData((prev) => ({ ...prev, directorSignature: "" }));
    try {
      localStorage.removeItem("nalanda_director_sign");
    } catch (err) {
      console.warn("Could not remove from localStorage", err);
    }
    toast.success("Principal / Director signature removed");
  };

  // Save changes to student's database profile
  const handleSaveToProfile = async () => {
    if (!cardData.studentId) {
      toast("Card custom details ready to print!", { icon: "ℹ️" });
      return;
    }

    setSaving(true);
    try {
      await updateStudent(cardData.studentId, {
        name: cardData.studentName,
        fatherName: cardData.fatherName,
        motherName: cardData.motherName,
        rollNo: cardData.rollNo,
        phone: cardData.phone,
        duration: cardData.duration,
        photo: cardData.photo,
        bloodGroup: cardData.bloodGroup,
        dob: cardData.dob,
        aadharNo: cardData.aadharNo,
        idCardNo: cardData.idCardNo,
        address: cardData.address,
        signature: cardData.signature,
        directorSignature: cardData.directorSignature,
      });

      toast.success("Student details & signatures saved to database!");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Switch student from dropdown if list provided
  const handleSelectStudent = (studentId) => {
    const savedCollegeDirectorSign =
      typeof window !== "undefined"
        ? localStorage.getItem("nalanda_director_sign") || ""
        : "";
    const found = studentsList.find((s) => s._id === studentId);
    if (found) {
      const sName = found.user?.name || found.name || "";
      const sRoll = found.rollNo || "";
      const sClass = found.class?.name || found.class?.code || "BCA";
      const sDept = found.department?.name
        ? `Department of ${found.department.code || found.department.name}`
        : "Department of BCA";
      const sDuration = found.duration || `${found.admissionYear || 2024}-27`;
      const yearShort = (found.admissionYear ? String(found.admissionYear).slice(-2) : "24");

      setCardData({
        studentId: found._id,
        studentName: sName,
        fatherName: found.fatherName || "",
        motherName: found.motherName || "",
        dob: found.dob || "",
        className: sClass,
        rollNo: sRoll,
        idCardNo: found.idCardNo || `NC/${sClass}/${yearShort}/${sRoll}`,
        aadharNo: found.aadharNo || "",
        address: found.address || "",
        phone: found.phone || "",
        duration: sDuration,
        department: sDept,
        bloodGroup: found.bloodGroup || "O+",
        photo: found.photo || "",
        signature: found.signature || "",
        directorSignature: found.directorSignature || savedCollegeDirectorSign || "",
        directorTitle: found.directorTitle || "Sign. of Director",
        collegeName: "NALANDA COLLEGE",
        affilText: "(A Constituent Unit of Patliputra University, Patna)",
        locationText: "Biharsharif, Nalanda- 803101 (Bihar)",
        estdText: "Estd. 1870",
        motto: "Your Success is our Mission.",
      });
      toast.success(`Loaded ${sName}`);
    }
  };

  // 100% Reliable Isolated Iframe Printing
  const handlePrint = () => {
    const cardEl = document.getElementById("printable-student-id-card");
    if (!cardEl) {
      toast.error("ID Card element not found");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card - ${cardData.studentName}</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .print-card-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            }
          </style>
          ${Array.from(document.querySelectorAll("link[rel='stylesheet']")).map((l) => l.outerHTML).join("\n")}
          ${Array.from(document.querySelectorAll("style")).map((s) => s.outerHTML).join("\n")}
        </head>
        <body>
          <div class="print-card-wrapper">
            ${cardEl.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {/* Studio Dialog Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white my-auto max-h-[94vh]">
        
        {/* ── Modal Top Header (Hidden during print) ────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Nalanda College Identity Card Studio
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Official Format
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Generate, edit details, upload student photo, and print official vertical ID badge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher on mobile/tablet */}
            {isAdmin && (
              <div className="flex lg:hidden bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    activeTab === "preview"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Card
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
            )}

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
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

        {/* ── Main Body: Editor (Left) & Real Nalanda ID Card (Right) ────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-100/70 dark:bg-slate-950/40">
          
          {/* ── LEFT PANE: Editor Controls (Admin only) ─────────────────────── */}
          {isAdmin && (
            <div
              className={`lg:col-span-6 space-y-4 ${
                activeTab === "preview" ? "hidden lg:block" : "block"
              }`}
            >
              {/* Quick Student Switcher */}
              {studentsList.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Student to Load
                  </label>
                  <select
                    value={cardData.studentId}
                    onChange={(e) => handleSelectStudent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">-- Choose student --</option>
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
                  <Camera className="w-4 h-4 text-red-600" />
                  Student Photograph (Passport Size)
                </h4>

                <div className="flex items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-16 h-20 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-sky-100 dark:bg-sky-950/40 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {cardData.photo ? (
                      <img
                        src={cardData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1">
                        <User className="w-6 h-6 text-slate-400 mx-auto" />
                        <span className="text-[9px] text-slate-400 block font-semibold">
                          No Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload / Remove Buttons */}
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Photo
                      </button>

                      {cardData.photo && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Standard passport portrait photo. Blue background recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Signatures (Student & Principal/Director) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-red-600" />
                    Official Signatures (Student & Principal)
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    JPG / PNG / Transparent
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 1. Student / Candidate Signature */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Candidate Sign
                      </label>
                      {cardData.signature ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Custom Photo
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          Auto Script
                        </span>
                      )}
                    </div>

                    {/* Signature Preview Box */}
                    <div className="h-16 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center p-1.5 relative overflow-hidden shadow-inner">
                      {cardData.signature ? (
                        <img
                          src={cardData.signature}
                          alt="Candidate Signature"
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="text-[12px] font-serif italic text-blue-600 dark:text-blue-400 font-bold">
                          {cardData.studentName
                            ? cardData.studentName.split(" ")[0].toLowerCase()
                            : "candidate"}
                        </span>
                      )}
                    </div>

                    {/* Upload & Remove Buttons */}
                    <input
                      type="file"
                      ref={studentSignInputRef}
                      accept="image/*"
                      onChange={handleStudentSignUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => studentSignInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{cardData.signature ? "Change Sign" : "Upload Sign"}</span>
                      </button>

                      {cardData.signature && (
                        <button
                          type="button"
                          onClick={handleRemoveStudentSign}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          title="Remove signature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">
                      Upload candidate's signature on white paper or transparent PNG.
                    </p>
                  </div>

                  {/* 2. Principal / Director Signature */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <select
                        value={cardData.directorTitle || "Sign. of Director"}
                        onChange={(e) => setCardData({ ...cardData, directorTitle: e.target.value })}
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 cursor-pointer"
                      >
                        <option value="Sign. of Director">Sign. of Director</option>
                        <option value="Sign. of Principal">Sign. of Principal</option>
                      </select>
                      {cardData.directorSignature ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3" /> Saved Default
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Signature Preview Box */}
                    <div className="h-16 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center p-1.5 relative overflow-hidden shadow-inner">
                      {cardData.directorSignature ? (
                        <img
                          src={cardData.directorSignature}
                          alt="Principal Signature"
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      ) : (
                        <span className="text-[13px] font-serif italic text-slate-800 dark:text-slate-200 font-bold">
                          RKSharma
                        </span>
                      )}
                    </div>

                    {/* Upload & Remove Buttons */}
                    <input
                      type="file"
                      ref={directorSignInputRef}
                      accept="image/*"
                      onChange={handleDirectorSignUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => directorSignInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{cardData.directorSignature ? "Change Sign" : "Upload Sign"}</span>
                      </button>

                      {cardData.directorSignature && (
                        <button
                          type="button"
                          onClick={handleRemoveDirectorSign}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          title="Remove signature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">
                      Saved college-wide. Applied to all student ID cards automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact Nalanda College Form Fields */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-red-600" />
                  Card Particulars (Exact College Fields)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Student Name */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Student Name (Green Bold) *
                    </label>
                    <input
                      type="text"
                      value={cardData.studentName}
                      onChange={(e) =>
                        setCardData({ ...cardData, studentName: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase font-bold"
                      placeholder="e.g. MD HUZAIFA"
                    />
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      value={cardData.fatherName}
                      onChange={(e) =>
                        setCardData({ ...cardData, fatherName: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                      placeholder="e.g. MD CHAND"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={cardData.motherName}
                      onChange={(e) =>
                        setCardData({ ...cardData, motherName: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                      placeholder="e.g. ZEENAT KAUSAR"
                    />
                  </div>

                  {/* D.O.B. */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Date of Birth (D.O.B.)
                    </label>
                    <input
                      type="text"
                      value={cardData.dob}
                      onChange={(e) => setCardData({ ...cardData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      placeholder="e.g. 09/12/2005"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      value={cardData.className}
                      onChange={(e) =>
                        setCardData({ ...cardData, className: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase font-bold"
                      placeholder="e.g. BCA"
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={cardData.rollNo}
                      onChange={(e) =>
                        setCardData({ ...cardData, rollNo: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                      placeholder="e.g. 14"
                    />
                  </div>

                  {/* I.D. Number */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      I.D. NO. (Banner Header)
                    </label>
                    <input
                      type="text"
                      value={cardData.idCardNo}
                      onChange={(e) =>
                        setCardData({ ...cardData, idCardNo: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase font-mono font-bold"
                      placeholder="e.g. NC/MCA/24/14"
                    />
                  </div>

                  {/* Aadhar Number */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={cardData.aadharNo}
                      onChange={(e) => setCardData({ ...cardData, aadharNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                      placeholder="e.g. 3696 1865 6211"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Mobile Number (MOB NO.)
                    </label>
                    <input
                      type="text"
                      value={cardData.phone}
                      onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                      placeholder="e.g. 8340502099"
                    />
                  </div>

                  {/* Session */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Session
                    </label>
                    <input
                      type="text"
                      value={cardData.duration}
                      onChange={(e) => setCardData({ ...cardData, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                      placeholder="e.g. 2024-27"
                    />
                  </div>

                  {/* Department Banner Text */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Blue Ribbon Text
                    </label>
                    <input
                      type="text"
                      value={cardData.department}
                      onChange={(e) => setCardData({ ...cardData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      placeholder="e.g. Department of BCA"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Blood Group (Red Drop)
                    </label>
                    <select
                      value={cardData.bloodGroup}
                      onChange={(e) => setCardData({ ...cardData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-", ""].map((bg) => (
                        <option key={bg} value={bg}>{bg || "None"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address (Full Row) */}
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Address (Upper Case)
                  </label>
                  <textarea
                    rows={2}
                    value={cardData.address}
                    onChange={(e) =>
                      setCardData({ ...cardData, address: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                    placeholder="e.g. BADI DARGAH , PO+PS- BIHARSHARIF, NALANDA 803101"
                  />
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
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Details & Photo to Student Profile
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ── RIGHT PANE: The Exact Physical Nalanda College ID Card ─────── */}
          <div
            className={`flex flex-col items-center justify-center space-y-4 ${
              isAdmin ? "lg:col-span-6" : "col-span-12"
            } ${activeTab === "edit" ? "hidden lg:flex" : "flex"}`}
          >
            <div className="w-full flex items-center justify-between px-2 text-xs font-semibold text-slate-500 print:hidden">
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                <Sparkles className="w-4 h-4" /> Nalanda College Official Card Preview
              </span>
              <span>Vertical Badge Format</span>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                EXACT NALANDA COLLEGE PHYSICAL ID CARD (PIXEL-PERFECT REPLICA)
                ══════════════════════════════════════════════════════════════════ */}
            <div
              id="printable-student-id-card"
              ref={cardRef}
              className="w-[300px] min-h-[490px] bg-white border-2 border-slate-300 rounded-xl shadow-2xl relative overflow-hidden text-slate-900 font-sans flex flex-col justify-between"
              style={{
                backgroundColor: "#ffffff",
                color: "#0f172a",
                boxSizing: "border-box",
              }}
            >
              {/* ── Top Maroon Header ── */}
              <div
                className="pt-2 pb-2 px-2 text-center relative border-b border-amber-400/40"
                style={{ backgroundColor: "#8b1d24", color: "#ffffff" }}
              >
                {/* College Crest / Logo + Estd */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-[7.5px] font-bold text-amber-200 tracking-tight leading-none mb-0.5">
                      {cardData.estdText}
                    </span>
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-7 h-7 rounded-full bg-white p-0.5 shadow-sm object-contain"
                    />
                  </div>

                  <div className="text-center flex-1">
                    <h2
                      className="text-sm font-black tracking-wider uppercase leading-tight font-serif"
                      style={{ color: "#ffffff", letterSpacing: "0.04em" }}
                    >
                      {cardData.collegeName}
                    </h2>
                    <p
                      className="text-[7.5px] font-bold leading-tight mt-0.5"
                      style={{ color: "#fef08a" }}
                    >
                      {cardData.affilText}
                    </p>
                    <p className="text-[7px] text-slate-100 tracking-tight mt-0.5 font-medium leading-none">
                      {cardData.locationText}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Arched Blue Ribbon Banner: Department of BCA ── */}
              <div className="relative text-center px-1 pt-0.5 pb-2">
                <div
                  className="mx-auto py-1 px-3 rounded-b-xl shadow-xs"
                  style={{
                    backgroundColor: "#1e3a8a",
                    color: "#ffffff",
                  }}
                >
                  <h3 className="text-xs font-black tracking-wider uppercase text-white font-sans drop-shadow-xs">
                    {cardData.department}
                  </h3>
                </div>

                {/* Overlapping IDENTITY CARD pill */}
                <div className="relative -mt-1.5 flex justify-center">
                  <span
                    className="inline-block px-3 py-0.5 bg-white border border-red-600 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xs"
                    style={{ color: "#b91c1c", backgroundColor: "#ffffff" }}
                  >
                    IDENTITY CARD
                  </span>
                </div>

                {/* I.D. NO. text */}
                <div className="mt-1 text-center">
                  <span className="text-[10px] font-black text-slate-900 tracking-tight">
                    I.D.NO: -{cardData.idCardNo}
                  </span>
                </div>
              </div>

              {/* ── Middle: Passport Photo + Blood Droplet ── */}
              <div className="px-4 flex items-center justify-center relative">
                {/* Rectangular Passport Photo */}
                <div
                  className="w-[88px] h-[108px] border-2 border-slate-700 bg-sky-200 rounded-sm overflow-hidden shadow-xs flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#bae6fd" }}
                >
                  {cardData.photo ? (
                    <img
                      src={cardData.photo}
                      alt={cardData.studentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <User className="w-8 h-8 text-slate-500 mx-auto" />
                      <span className="text-[8px] font-black text-slate-600 block mt-1">
                        PHOTO
                      </span>
                    </div>
                  )}
                </div>

                {/* Blood Droplet on the Right side */}
                <div className="absolute right-6 flex flex-col items-center justify-center">
                  <div className="relative">
                    <svg viewBox="0 0 100 130" className="w-8 h-10 drop-shadow-xs">
                      <defs>
                        <radialGradient id="nalandaBloodGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#f87171" />
                          <stop offset="45%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#8b1d24" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M50 0 C50 0 95 65 95 90 A45 45 0 0 1 5 90 C5 65 50 0 50 0 Z"
                        fill="url(#nalandaBloodGrad)"
                      />
                      <path
                        d="M30 65 A20 20 0 0 1 45 45"
                        stroke="#ffffff"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.6"
                      />
                    </svg>
                    {cardData.bloodGroup && (
                      <span className="absolute inset-0 flex items-center justify-center pt-2.5 text-[9px] font-black text-white drop-shadow">
                        {cardData.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Student Name in Bold Dark Green ── */}
              <div className="text-center mt-1.5 px-2">
                <h4
                  className="text-xs font-black uppercase tracking-wider leading-none"
                  style={{ color: "#15803d" }}
                >
                  {cardData.studentName || "STUDENT NAME"}
                </h4>
              </div>

              {/* ── Detailed Student Particulars Table ── */}
              <div className="px-3.5 py-1 text-[9px] font-bold text-slate-900 leading-tight space-y-1">
                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">FATHER'S NAME</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 uppercase font-bold text-slate-900 truncate">
                    {cardData.fatherName || "—"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">MOTHER'S NAME</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 uppercase font-bold text-slate-900 truncate">
                    {cardData.motherName || "—"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">D.O.B.</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-bold text-slate-900">{cardData.dob || "—"}</span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">CLASS</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-black text-slate-900 uppercase">
                    {cardData.className || "—"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">ROLL</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-black text-slate-900">{cardData.rollNo || "—"}</span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">AADHAR NO.</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-mono font-bold text-slate-900">
                    {cardData.aadharNo || "—"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">ADDRESS</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 uppercase font-bold text-slate-900 text-[8.5px] leading-tight break-words">
                    {cardData.address || "—"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">MOB NO.</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-mono font-bold text-slate-900">{cardData.phone || "—"}</span>
                </div>

                <div className="flex">
                  <span className="w-24 shrink-0 font-extrabold text-slate-800">SESSION</span>
                  <span className="w-3 shrink-0 text-center">:</span>
                  <span className="flex-1 font-black text-slate-900">{cardData.duration || "2024-27"}</span>
                </div>
              </div>

              {/* ── College Motto ── */}
              <div className="text-center py-0.5">
                <span
                  className="italic text-[9.5px] font-bold font-serif"
                  style={{ color: "#b45309" }}
                >
                  {cardData.motto}
                </span>
              </div>

              {/* ── Bottom Signatures Bar (Maroon Footer) ── */}
              <div
                className="px-3 py-1.5 flex items-end justify-between text-[7.5px] font-bold border-t border-amber-300/40 rounded-b-xl"
                style={{ backgroundColor: "#8b1d24", color: "#ffffff" }}
              >
                {/* 1. Student / Candidate Signature */}
                <div className="text-center flex flex-col items-center">
                  {cardData.signature ? (
                    <div className="h-6 w-24 bg-white/95 rounded px-1 flex items-center justify-center overflow-hidden mb-0.5 shadow-2xs">
                      <img
                        src={cardData.signature}
                        alt="Sign of Candidate"
                        className="max-h-5 max-w-full object-contain filter contrast-125"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-5 flex items-center justify-center font-serif italic text-[11px] leading-none mb-0.5 tracking-wider"
                      style={{ color: "#93c5fd" }}
                    >
                      {cardData.studentName
                        ? cardData.studentName.split(" ")[0].toLowerCase()
                        : "candidate"}
                    </div>
                  )}
                  <div className="border-t border-white/60 pt-0.5 text-white w-24 text-center">
                    Sign. of Candidate
                  </div>
                </div>

                {/* 2. Principal / Director Signature */}
                <div className="text-center flex flex-col items-center">
                  {cardData.directorSignature ? (
                    <div className="h-6 w-24 bg-white/95 rounded px-1 flex items-center justify-center overflow-hidden mb-0.5 shadow-2xs">
                      <img
                        src={cardData.directorSignature}
                        alt="Sign of Director"
                        className="max-h-5 max-w-full object-contain filter contrast-125"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-5 flex items-center justify-center font-serif italic text-[12px] leading-none mb-0.5 tracking-wider font-bold"
                      style={{ color: "#ffffff" }}
                    >
                      RKSharma
                    </div>
                  )}
                  <div className="border-t border-white/60 pt-0.5 text-white w-24 text-center">
                    {cardData.directorTitle || "Sign. of Director"}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center print:hidden">
              💡 Exact Nalanda College Identity Card layout. Click <strong className="text-red-600">Print / Save PDF</strong> to generate official print.
            </p>
          </div>
        </div>

        {/* ── Bottom Footer ── */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden shrink-0">
          <div className="text-xs text-slate-500">
            {cardData.studentId ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Linked to Student Profile ({cardData.studentName})
              </span>
            ) : (
              <span>Stand-alone Identity Card</span>
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
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
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
