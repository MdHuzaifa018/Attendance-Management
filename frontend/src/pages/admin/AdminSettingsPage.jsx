import { useState, useRef } from "react";
import {
  Building2,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  FileCheck,
  Loader2,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";

// Helper: Compress uploaded logo to lightweight Base64 DataURL
const compressLogoImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG format to preserve transparent backgrounds
        const outputFormat = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(outputFormat, 0.9));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminSettingsPage = () => {
  const { logo, settings, updateSettings, resetLogo, loading } = useCollegeSettings();

  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);

  // Local form state initialized from context
  const [formData, setFormData] = useState({
    collegeName: settings?.collegeName || "NALANDA COLLEGE",
    tagline: settings?.tagline || "Attendance & Academic Management System",
    affilText: settings?.affilText || "(A Constituent Unit of Patliputra University, Patna)",
    locationText: settings?.locationText || "Biharsharif, Nalanda- 803101 (Bihar)",
    estdText: settings?.estdText || "Estd. 1870",
    logo: logo || "/logo.png",
  });

  // Handle Logo File Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG, WEBP)");
      return;
    }

    try {
      const base64Logo = await compressLogoImage(file);
      setFormData((prev) => ({ ...prev, logo: base64Logo }));
      toast.success("New logo selected! Click 'Save Changes' to apply everywhere.");
    } catch {
      toast.error("Failed to process logo image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Reset to default /logo.png
  const handleResetToDefaultLogo = async () => {
    try {
      await resetLogo();
      setFormData((prev) => ({ ...prev, logo: "/logo.png" }));
      toast.success("Logo reset to default college crest!");
    } catch {
      toast.error("Failed to reset logo");
    }
  };

  // Save all settings to database & update whole app
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      toast.success("Logo & College Settings updated everywhere!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* ── Top Header Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Global Institute Identity & Logo Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              College Logo & Branding
            </h1>
            <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
              Upload your official college logo here. Once saved, it will update{" "}
              <strong>automatically in real-time everywhere</strong> across Navbars, Sidebars, Login
              pages, Student ID cards, and Print Reports!
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Logo Studio (7 Cols) ────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    College Crest / Logo
                  </h2>
                  <p className="text-xs text-slate-500">
                    High resolution PNG, JPG, WEBP, or SVG with transparent background recommended
                  </p>
                </div>
              </div>
            </div>

            {/* Dual Background Preview Studio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Preview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  ☀️ Light Background Preview
                </span>
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center mb-2">
                  <img
                    src={formData.logo}
                    alt="Logo Preview Light"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-600 truncate max-w-[200px]">
                  {formData.collegeName}
                </p>
              </div>

              {/* Dark Mode Preview Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  🌙 Dark Mode Preview
                </span>
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-inner flex items-center justify-center mb-2">
                  <img
                    src={formData.logo}
                    alt="Logo Preview Dark"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-300 truncate max-w-[200px]">
                  {formData.collegeName}
                </p>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload New Logo
              </button>

              <button
                type="button"
                onClick={handleResetToDefaultLogo}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Default
              </button>
            </div>

            {/* Checklist of Everywhere it updates */}
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Real-Time Live Sync Checklist:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Admin, Teacher & Student Sidebars</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Public Home Navbar & Footer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Official Student ID Card Crest</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Login & Student Register Screens</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Printable Attendance Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Browser Tab Favicon & PWA App Icons</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: College Particulars (5 Cols) ───────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  College Identity Details
                </h3>
                <p className="text-xs text-slate-500">Official names and affiliations</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* College Full Name */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  College / Institute Name
                </label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  placeholder="e.g. NALANDA COLLEGE"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  System Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="e.g. Attendance & Academic Management System"
                />
              </div>

              {/* Affiliation line */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  University Affiliation Text
                </label>
                <input
                  type="text"
                  value={formData.affilText}
                  onChange={(e) => setFormData({ ...formData, affilText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="e.g. (A Constituent Unit of Patliputra University, Patna)"
                />
              </div>

              {/* Estd Year */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Establishment Year (Estd.)
                </label>
                <input
                  type="text"
                  value={formData.estdText}
                  onChange={(e) => setFormData({ ...formData, estdText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="e.g. Estd. 1870"
                />
              </div>

              {/* Location Text */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Campus Address / Location
                </label>
                <textarea
                  rows={2}
                  value={formData.locationText}
                  onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="e.g. Biharsharif, Nalanda- 803101 (Bihar)"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save All Settings & Logo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
