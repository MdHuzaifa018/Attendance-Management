import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCollegeSettings,
  updateCollegeSettings,
  resetCollegeLogo as apiResetLogo,
} from "../services/settingService.js";

const DEFAULT_SETTINGS = {
  collegeName: "NALANDA COLLEGE",
  tagline: "Attendance & Academic Management System",
  affilText: "(A Constituent Unit of Patliputra University, Patna)",
  locationText: "Biharsharif, Nalanda- 803101 (Bihar)",
  estdText: "Estd. 1870",
  logo: "/logo.png",
};

const CollegeSettingsContext = createContext(null);

export const CollegeSettingsProvider = ({ children }) => {
  // Synchronous initial read from localStorage for instant, zero-flicker render
  const [logo, setLogo] = useState(() => {
    try {
      return localStorage.getItem("college_logo") || DEFAULT_SETTINGS.logo;
    } catch {
      return DEFAULT_SETTINGS.logo;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("college_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Helper to dynamically update browser tab favicon and touch icons
  const applyFavicon = (iconUrl) => {
    if (!iconUrl || typeof document === "undefined") return;
    try {
      const iconLink =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      iconLink.rel = "icon";
      iconLink.type = "image/png";
      iconLink.href = iconUrl;
      if (!document.head.contains(iconLink)) {
        document.head.appendChild(iconLink);
      }

      const appleTouch =
        document.querySelector("link[rel='apple-touch-icon']") ||
        document.createElement("link");
      appleTouch.rel = "apple-touch-icon";
      appleTouch.href = iconUrl;
      if (!document.head.contains(appleTouch)) {
        document.head.appendChild(appleTouch);
      }
    } catch (e) {
      console.warn("Favicon update skipped", e);
    }
  };

  // Fetch settings from server on initial load
  const loadSettings = useCallback(async () => {
    try {
      const data = await getCollegeSettings();
      if (data) {
        setSettings(data);
        const activeLogo = data.logo || DEFAULT_SETTINGS.logo;
        setLogo(activeLogo);
        try {
          localStorage.setItem("college_logo", activeLogo);
          localStorage.setItem("college_settings", JSON.stringify(data));
        } catch (e) {
          console.warn("Storage write error", e);
        }
        applyFavicon(activeLogo);
      }
    } catch (err) {
      console.warn("Could not fetch remote college settings, using cached/defaults", err);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    applyFavicon(logo);

    // Cross-tab synchronization
    const handleStorageChange = (e) => {
      if (e.key === "college_logo" && e.newValue) {
        setLogo(e.newValue);
        applyFavicon(e.newValue);
      }
      if (e.key === "college_settings" && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadSettings, logo]);

  // Update complete settings or partial fields
  const updateSettings = async (newData) => {
    setLoading(true);
    try {
      const updated = await updateCollegeSettings(newData);
      if (updated) {
        setSettings(updated);
        const newLogo = updated.logo || DEFAULT_SETTINGS.logo;
        setLogo(newLogo);
        try {
          localStorage.setItem("college_logo", newLogo);
          localStorage.setItem("college_settings", JSON.stringify(updated));
        } catch (e) {
          console.warn("Storage write error", e);
        }
        applyFavicon(newLogo);
      }
      return updated;
    } finally {
      setLoading(false);
    }
  };

  // Dedicated helper to update just the logo
  const updateLogo = async (base64OrUrl) => {
    return updateSettings({ logo: base64OrUrl });
  };

  // Reset logo back to /logo.png
  const resetLogo = async () => {
    setLoading(true);
    try {
      const updated = await apiResetLogo();
      const defaultLogoPath = updated?.logo || DEFAULT_SETTINGS.logo;
      setLogo(defaultLogoPath);
      setSettings((prev) => ({ ...prev, logo: defaultLogoPath }));
      try {
        localStorage.setItem("college_logo", defaultLogoPath);
        localStorage.setItem(
          "college_settings",
          JSON.stringify({ ...settings, logo: defaultLogoPath })
        );
      } catch (e) {
        console.warn("Storage write error", e);
      }
      applyFavicon(defaultLogoPath);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollegeSettingsContext.Provider
      value={{
        logo,
        settings,
        loading,
        updateSettings,
        updateLogo,
        resetLogo,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </CollegeSettingsContext.Provider>
  );
};

export const useCollegeSettings = () => {
  const context = useContext(CollegeSettingsContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      logo: "/logo.png",
      settings: DEFAULT_SETTINGS,
      loading: false,
      updateSettings: async () => {},
      updateLogo: async () => {},
      resetLogo: async () => {},
      refreshSettings: async () => {},
    };
  }
  return context;
};
