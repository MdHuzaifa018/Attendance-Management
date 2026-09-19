import api from "./api";

/**
 * Fetch real-time public college statistics from backend MongoDB.
 * Returns null if backend is unreachable (triggers fallback).
 */
export const getPublicStats = async () => {
  try {
    const res = await api.get("/public/stats");
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Fetch official public notices from backend MongoDB.
 * Includes built-in retry for MongoDB Atlas cold-start scenarios.
 * Returns null if backend is unreachable after all attempts (triggers fallback).
 */
export const getPublicNotices = async (retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await api.get("/public/notices", { timeout: 8000 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.warn(`[getPublicNotices] Attempt ${attempt}/${retries} failed:`, err?.message || err);
      if (attempt < retries) {
        // Wait 1.5s before retrying — gives Atlas time to wake up
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
  return null;
};

/**
 * Fetch active weekly timetable routine from backend MongoDB.
 * Returns null if backend is unreachable (triggers fallback).
 */
export const getPublicTimetable = async () => {
  try {
    const res = await api.get("/public/timetable");
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
};
