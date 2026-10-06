import { useState, useEffect } from "react";
import {
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Check,
  UserCheck,
} from "lucide-react";
import { useCollegeSettings } from "../../context/CollegeSettingsContext.jsx";

/**
 * PremiumLoader
 * State-of-the-art Nalanda College ERP Academic Loader
 * Features:
 * - Concentric orbital celestial rings with clockwise/counter-clockwise motion
 * - Ambient background mesh and glowing auroras
 * - Dynamic stage progression bar (78% -> 100%)
 * - Seamless Light & Dark mode support
 */
const PremiumLoader = ({
  fullScreen = true,
  customTitle = "Nalanda College ERP",
  customSubtitle = "Preparing your academic dashboard",
}) => {
  const { logo, settings } = useCollegeSettings();

  const [currentPct, setCurrentPct] = useState(78);
  const [dots, setDots] = useState("...");
  const [stage, setStage] = useState("Roster Sync");
  const [statusText, setStatusText] = useState("Synchronizing student roster & schedule...");

  // Animated progressive ellipsis
  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  // Dynamic progressive loader stages
  useEffect(() => {
    const targetSteps = [
      { pct: 82, text: "Synchronizing student roster & schedule...", stage: "Roster Sync" },
      { pct: 89, text: "Validating faculty & student biometric credentials...", stage: "Auth Validated" },
      { pct: 95, text: "Compiling daily lecture attendance sheets...", stage: "Sheets Compiled" },
      { pct: 100, text: "Dashboard ready! Launching portal...", stage: "Finalizing" },
    ];

    let stepIndex = 0;
    let incrementTimer;
    let stepTimeout;

    const runProgress = () => {
      if (stepIndex < targetSteps.length) {
        const item = targetSteps[stepIndex];
        const stepTarget = item.pct;

        incrementTimer = setInterval(() => {
          setCurrentPct((prev) => {
            if (prev < stepTarget) {
              return prev + 1;
            } else {
              clearInterval(incrementTimer);
              setStatusText(item.text);
              setStage(item.stage);
              stepIndex++;
              stepTimeout = setTimeout(runProgress, 1200);
              return prev;
            }
          });
        }, 40);
      } else {
        // Soft loop if still waiting
        stepTimeout = setTimeout(() => {
          setCurrentPct(75);
          stepIndex = 0;
          setStatusText("Updating class attendance registries...");
          setStage("Syncing Hub");
          setTimeout(runProgress, 1000);
        }, 3000);
      }
    };

    const initialTimeout = setTimeout(runProgress, 800);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(stepTimeout);
      clearInterval(incrementTimer);
    };
  }, []);

  const content = (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none">
      {/* ── Background Mesh & Ambient Glow Orbs ──────────────────────── */}
      <div className="fixed inset-0 pointer-events-none bg-academic-mesh z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-gradient-to-br from-blue-400/15 via-teal-300/10 to-indigo-400/10 dark:from-blue-600/10 dark:via-teal-500/10 dark:to-indigo-600/10 rounded-full blur-[110px] pointer-events-none z-0 anim-aura" />
      <div className="fixed -bottom-40 right-1/4 w-[480px] h-[480px] bg-gradient-to-tr from-teal-400/10 via-blue-500/10 to-purple-400/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-[200%] h-48 bg-gradient-to-b from-transparent via-blue-500/5 dark:via-blue-400/5 to-transparent anim-beam" />
      </div>

      {/* ── Top Header Bar ───────────────────────────────────────────── */}
      <header className="relative z-20 w-full px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-1">
            <img
              src={logo || "/logo.png"}
              alt="Nalanda College Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
              Nalanda College ERP
            </span>
            <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 hidden sm:inline">
              v2.4.0
            </span>
          </div>
        </div>

        {/* Secure session pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 font-medium tracking-tight">
            Secure Session • TLS 1.3
          </span>
        </div>
      </header>

      {/* ── Main Center Animation & Progress ──────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 py-8">
        <div className="flex flex-col items-center max-w-lg w-full text-center relative">
          
          {/* Orbital Celestial Emblem Container */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8 select-none">
            {/* Soft background aura glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/10 via-teal-500/10 to-indigo-500/10 blur-2xl anim-aura" />
            
            {/* Ring 1: Clockwise Dashed */}
            <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/40 dark:border-blue-400/30 anim-spin-cw" />
            
            {/* Ring 2: Counter-Clockwise Dotted */}
            <div
              className="absolute inset-7 rounded-full border border-teal-500/35 anim-spin-ccw"
              style={{ borderWidth: "1.5px", borderStyle: "dashed" }}
            />
            
            {/* Ring 3: Inner subtle ring */}
            <div className="absolute inset-12 rounded-full border border-indigo-300/40 dark:border-indigo-500/30" />

            {/* Orbiting celestial planets (Blue, Teal, Indigo) */}
            <div className="absolute inset-0 anim-spin-cw pointer-events-none">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
              <div className="absolute bottom-4 left-1/4 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6]" />
            </div>
            <div className="absolute inset-0 anim-spin-ccw pointer-events-none">
              <div className="absolute top-1/3 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            </div>

            {/* Floating Chip 1: Top-Right "Present" */}
            <div className="absolute -top-1 -right-3 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1.5 anim-float z-20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[10.5px] font-semibold text-emerald-800 dark:text-emerald-300">
                Present
              </span>
            </div>

            {/* Floating Chip 2: Bottom-Left "Roster Sync" */}
            <div className="absolute -bottom-2 -left-4 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-blue-100 dark:border-blue-900/50 flex items-center gap-1.5 anim-float-alt z-20">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-[10.5px] font-semibold text-slate-700 dark:text-slate-200">
                Roster Sync
              </span>
            </div>

            {/* Center Emblem Glass Card */}
            <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/80 dark:border-slate-800 anim-badge flex items-center justify-center p-1.5">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-b from-slate-50/90 to-blue-50/50 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/70 dark:via-white/10 to-transparent translate-x-[-150%] anim-shimmer pointer-events-none" />
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center p-2">
                    {logo ? (
                      <img
                        src={logo}
                        alt="College Logo"
                        className="max-h-full max-w-full object-contain filter drop-shadow"
                      />
                    ) : (
                      <GraduationCap className="w-8 h-8" />
                    )}
                  </div>
                  {/* Small verified green badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography Heading & Subheading */}
          <div className="flex flex-col items-center space-y-1.5 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white font-black tracking-tight">
              {customTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
              <span>{customSubtitle}</span>
              <span className="inline-flex w-5 text-left font-bold text-blue-600 dark:text-blue-400">
                {dots}
              </span>
            </p>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="w-full max-w-xs mt-7 flex flex-col items-center">
            {/* Track */}
            <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 p-[1.5px] shadow-inner relative overflow-hidden backdrop-blur-xs">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${currentPct}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full anim-shimmer" />
              </div>
            </div>

            {/* Metrics */}
            <div className="w-full flex items-center justify-between mt-2.5 px-0.5">
              <span className="font-mono text-[11.5px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                <span>{stage}</span>
              </span>
              <span className="font-mono font-semibold text-[12.5px] text-slate-800 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700 px-2 py-0.5 rounded-md">
                {currentPct}%
              </span>
            </div>

            {/* Micro Status Chip */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-spin" />
              <span className="truncate max-w-[260px] font-medium">
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full px-6 md:px-12 py-5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span>{settings?.collegeName || "Nalanda College"} • Biharsharif</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline">Academic Portal</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-xs shadow-teal-500/50" />
          <span>Campus Gateway Active</span>
        </div>
      </footer>
    </div>
  );

  if (!fullScreen) {
    return <div className="py-12 flex justify-center items-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center">
      {content}
    </div>
  );
};

export default PremiumLoader;
