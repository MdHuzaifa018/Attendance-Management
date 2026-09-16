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
 * Returns null if backend is unreachable (triggers fallback).
 */
export const getPublicNotices = async () => {
  try {
    const res = await api.get("/public/notices");
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
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
