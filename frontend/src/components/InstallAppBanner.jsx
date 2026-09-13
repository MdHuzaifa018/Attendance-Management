import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

const InstallAppBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Check if user previously dismissed
      const dismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Install App"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-slate-900/95 border border-indigo-500/40 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-bounce-subtle print:hidden"
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/40">
        <Smartphone className="w-5 h-5 text-white" />
      </div>

      <div className="flex-1 min-w-0 text-xs">
        <h4 className="font-bold text-white text-xs">Install Nalanda ERP App</h4>
        <p className="text-[11px] text-slate-300 mt-0.5 leading-tight truncate">
          Add to your home screen for faster attendance marking.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default InstallAppBanner;
