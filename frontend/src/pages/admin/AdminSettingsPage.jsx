import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  FileCheck,
  Loader2,
  Sliders,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Mail,
  User,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { uploadImageToCloudinary } from "../../services/uploadService.js";

const AdminSettingsPage = () => {
  const { logo, settings, updateSettings, resetLogo, loading } = useCollegeSettings();
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("branding"); // "branding" | "security"

  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // College Branding Form State
  const [formData, setFormData] = useState({
    collegeName: settings?.collegeName || "NALANDA COLLEGE",
    tagline: settings?.tagline || "Attendance & Academic Management System",
    affilText: settings?.affilText || "(A Constituent Unit of Patliputra University, Patna)",
    locationText: settings?.locationText || "MOHALLA-GARHPAR, NAISARAI, BIHAR SHARIF 803101",
    address: settings?.address || "NALANDA COLLEGE 'NEW EXAMINATION HALL', MOHALLA-GARHPAR, NAISARAI, BIHAR SHARIF 803101",
    email: settings?.email || "nalandacollegebiharsharif@gmail.com",
    estdText: settings?.estdText || "Estd. 1870",
    logo: logo || "/logo.png",
  });

  // Admin Account & Security Form State
  const [adminName, setAdminName] = useState(user?.name || "");
  const [adminEmail, setAdminEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setAdminName(user.name || "");
      setAdminEmail(user.email || "");
    }
  }, [user]);

  // Handle Logo File Upload to Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG, WEBP)");
      return;
    }

    setUploadingLogo(true);
    const loadingToast = toast.loading("Uploading college logo to Cloudinary...");
    try {
      const res = await uploadImageToCloudinary(file, "college/logo");
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, logo: res.data.url }));
        toast.success("Logo uploaded to Cloudinary! Click 'Save Changes' to apply everywhere.", {
          id: loadingToast,
        });
      } else {
        toast.error("Upload failed: No URL returned", { id: loadingToast });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to upload logo to Cloudinary. Check credentials.",
        { id: loadingToast }
      );
    } finally {
      setUploadingLogo(false);
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

  // Save all college branding settings
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

  // Save Admin Account & Password Update
  const handleAdminCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!adminName.trim()) {
      return toast.error("Admin name cannot be empty");
    }
    if (!adminEmail.trim()) {
      return toast.error("Admin email ID cannot be empty");
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return toast.error("New password must be at least 6 characters");
      }
      if (newPassword !== confirmPassword) {
        return toast.error("New password and Confirm password do not match");
      }
      if (!currentPassword) {
        return toast.error("Please enter your current password to confirm this change");
      }
    }

    setUpdatingAdmin(true);
    try {
      const payload = {
        name: adminName.trim(),
        email: adminEmail.trim(),
      };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await updateProfile(payload);
      toast.success("Admin ID & Security credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update admin credentials");
    } finally {
      setUpdatingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* ── Top Header Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>System Configuration & Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Settings & Security
            </h1>
            <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
              Manage official college branding, institute logos, contact info, and update your
              Administrator login credentials (Email ID & Password).
            </p>
          </div>

          {activeTab === "branding" && (
            <button
              onClick={handleSubmit}
              disabled={saving || loading}
              className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "branding"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>College Logo & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Account & Security (ID / Password)</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: COLLEGE LOGO & BRANDING ───────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Logo Studio (7 Cols) */}
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
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                    Light Theme Appearance
                  </span>
                  <div className="h-28 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-inner p-2">
                    <img
                      src={formData.logo}
                      alt="Light Preview"
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Dark Theme Appearance
                  </span>
                  <div className="h-28 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 shadow-inner p-2">
                    <img
                      src={formData.logo}
                      alt="Dark Preview"
                      className="max-h-24 max-w-full object-contain drop-shadow"
                    />
                  </div>
                </div>
              </div>

              {/* Upload & Reset Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Upload New Logo File
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Crest
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: College Metadata (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Institute Identity Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    System Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Affiliation Line
                  </label>
                  <input
                    type="text"
                    value={formData.affilText}
                    onChange={(e) => setFormData({ ...formData, affilText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Official College Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Branding & Logo
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: ADMIN ACCOUNT & SECURITY (ID & PASSWORD) ──────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Admin ID & Password Edit Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Administrator Credentials
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Change your Admin Name, Login Email (ID), or update your password
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminCredentialsSubmit} className="space-y-5">
                {/* Section A: Name & Email ID */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      Administrator Full Name
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. System Admin"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      Admin Login Email (Your ID)
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@nalanda.edu"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      This is the email address you use on the login screen.
                    </p>
                  </div>
                </div>

                {/* Section B: Password Reset Fields */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Change Password (Optional)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
                    Leave these password fields blank if you only want to update your name or email.
                  </p>

                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Password {newPassword && <span className="text-red-500">* (Required to change)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                          tabIndex={-1}
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                          tabIndex={-1}
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingAdmin}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {updatingAdmin ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Update Admin Credentials
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Security Status & Emergency CLI Reset (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Account Overview Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md shadow-indigo-600/30">
                  {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {user?.name || "System Admin"}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    Role: {user?.role || "admin"} (Superuser)
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Current Login Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency CLI Reset Instructions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400">
                <Terminal className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Emergency Command-Line Reset
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agar aap kabhi admin password bhul jayein ya login na kar sakein, toh terminal se
                direct reset kar sakte hain:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-emerald-400 select-all overflow-x-auto">
                node backend/scripts/resetAdminPassword.js
              </div>
              <p className="text-[11px] text-slate-500">
                Default reset credentials: <br />
                <code className="text-indigo-300">admin@nalanda.edu</code> / <code className="text-indigo-300">Admin@1234</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
