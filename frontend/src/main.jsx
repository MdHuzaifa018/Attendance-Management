import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * main.jsx — Application entry point.
 *
 * App.jsx handles BrowserRouter, AuthProvider, and Toaster internally,
 * so main.jsx stays minimal.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register PWA service worker
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) => console.error("Service Worker failed:", err));
  });
}

