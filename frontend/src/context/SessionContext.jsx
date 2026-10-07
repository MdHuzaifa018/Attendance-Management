import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [globalSession, setGlobalSession] = useState(() => {
    try {
      const saved = localStorage.getItem("nalanda_active_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const { data } = await api.get("/academic-sessions");
      if (data.success) {
        const sessionList = data.sessions || [];
        setSessions(sessionList);
        
        // Find current active session or preserve saved session
        const active = sessionList.find(s => s.isCurrent) || sessionList[0] || null;
        setGlobalSession((prev) => {
          // If we had a previously saved valid session from the list, keep it; else use active
          const validSaved = prev ? sessionList.find(s => s._id === prev._id) : null;
          const chosen = validSaved || active;
          if (chosen) {
            try {
              localStorage.setItem("nalanda_active_session", JSON.stringify(chosen));
            } catch {}
          }
          return chosen;
        });
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const switchSession = (sessionId) => {
    const sess = sessions.find((s) => s._id === sessionId);
    if (sess) {
      setGlobalSession(sess);
      try {
        localStorage.setItem("nalanda_active_session", JSON.stringify(sess));
      } catch {}
    }
  };

  const refreshSessions = async () => {
    await loadSessions();
  };

  return (
    <SessionContext.Provider value={{ sessions, globalSession, switchSession, refreshSessions, loading }}>
      {children}
    </SessionContext.Provider>
  );
};
