import { Sparkles } from "lucide-react";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";

/**
 * PremiumLoader
 * State-of-the-art loader matching Nalanda College ERP vibrant modern theme.
 * Fully responsive, supports both Light & Dark modes seamlessly.
 *
 * @param {string} message - Custom status text
 * @param {boolean} fullScreen - Whether to render full-screen or as an inline component
 */
const PremiumLoader = ({
  message = "Loading Academic Workspace...",
  fullScreen = true,
}) => {
  const { logo, settings } = useCollegeSettings();

  const content = (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-10 max-w-sm w-full mx-4 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-center transition-all animate-fadeIn">
      
      {/* Ambient background soft glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400/15 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Pulsing Emblem / Logo Container */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Soft glowing outer halo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-amber-400/30 blur-lg animate-pulse" />
        
        {/* Rotating subtle gradient border */}
        <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-lg border border-slate-100 dark:border-slate-700/80 flex items-center justify-center">
          <img
            src={logo || "/logo.png"}
            alt="Logo"
            className="max-h-full max-w-full object-contain animate-bounce-subtle"
          />
        </div>

        {/* Floating Sparkle Badge */}
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Brand Heading */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-sans">
          NALANDA
        </span>
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
          ERP
        </span>
      </div>

      {/* Subtitle Badge */}
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.22em] uppercase mb-5">
        {settings?.collegeName ? `${settings.collegeName} • Smart Campus` : "Smart Campus Academic Portal"}
      </p>

      {/* Smooth Liquid Progress Bar */}
      <div className="w-48 h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden relative mb-3.5 shadow-inner">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-400 rounded-full animate-loaderBar" />
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-ping" />
        <span className="truncate max-w-[240px] text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {message}
        </span>
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="py-12 flex justify-center items-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-300">
      {content}
    </div>
  );
};

export default PremiumLoader;
