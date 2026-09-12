import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer
        ${
          isDark
            ? "bg-slate-800/80 border-slate-700 text-amber-300 hover:bg-slate-700/80 hover:text-amber-200 shadow-sm"
            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 shadow-sm"
        } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
