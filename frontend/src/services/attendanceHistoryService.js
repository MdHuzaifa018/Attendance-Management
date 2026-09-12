import api from "./api.js";

/**
 * attendanceHistoryService — API client for history browsing, corrections, and audit logs.
 */

/**
 * Fetch paginated list of past attendance sessions with stats.
 * @param {Object} params — classId, subjectId, teacherId, startDate, endDate, session, page, limit
 */
export const getAttendanceSessions = async (params = {}) => {
  const { data } = await api.get("/attendance/history", { params });
  return data;
};

/**
 * Fetch all student records for a specific (class, subject, date, session) tuple.
 */
export const getSessionDetail = async ({ classId, subjectId, date, session }) => {
  const { data } = await api.get("/attendance/history/session", {
    params: { classId, subjectId, date, session },
  });
  return data;
};

/**
 * Correct a single student's attendance record.
 * @param {Object} payload — attendanceId, newStatus, reason (optional)
 */
export const correctAttendance = async (payload) => {
  const { data } = await api.patch("/attendance/history/correct", payload);
  return data;
};

/**
 * Fetch the system-wide audit log (admin only).
 */
export const getAuditLog = async (params = {}) => {
  const { data } = await api.get("/attendance/history/audit", { params });
  return data;
};
