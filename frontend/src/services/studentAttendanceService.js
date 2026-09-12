import api from "./api.js";

/**
 * studentAttendanceService — API client for the student's self-service attendance views.
 */

/**
 * Fetch per-subject attendance summary for the logged-in student.
 * Returns: student profile, overview totals, per-subject breakdown.
 */
export const getAttendanceSummary = async () => {
  const { data } = await api.get("/student-attendance/summary");
  return data;
};

/**
 * Fetch date-wise attendance timeline for the logged-in student.
 * @param {Object} params — subjectId (optional), startDate, endDate, page, limit
 */
export const getAttendanceTimeline = async (params = {}) => {
  const { data } = await api.get("/student-attendance/timeline", { params });
  return data;
};
