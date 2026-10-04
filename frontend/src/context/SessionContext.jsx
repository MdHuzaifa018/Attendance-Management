import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [globalSession, setGlobalSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const { data } = await api.get("/academic-sessions");
      if (data.success) {
        setSessions(data.sessions || []);
        
        // Find current active session
        const active = data.sessions.find(s => s.isCurrent);
        if (active) {
          setGlobalSession(active);
        } else if (data.sessions.length > 0) {
          setGlobalSession(data.sessions[0]);
        }
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
    if (sess) setGlobalSession(sess);
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
