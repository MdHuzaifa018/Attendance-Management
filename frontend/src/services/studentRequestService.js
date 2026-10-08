import api from "./api.js";

/**
 * Fetch student registration applications for the Admin panel.
 * @param {Object} params - { status, search, page, limit }
 */
export const getStudentRequests = async (params = {}) => {
  const { data } = await api.get("/student-requests", { params });
  return data;
};

/**
 * Fetch pending registration count (for sidebar notification badge).
 */
export const getPendingRequestsCount = async () => {
  try {
    const { data } = await api.get("/student-requests/count");
    return data?.count || 0;
  } catch {
    return 0;
  }
};

/**
 * Approve a student application (creates user + student profile + class enrollment).
 * @param {string} requestId
 */
export const approveStudentRequest = async (requestId) => {
  const { data } = await api.put(`/student-requests/${requestId}/approve`);
  return data;
};

/**
 * Reject a student application with optional reason.
 * @param {string} requestId
 * @param {string} reason
 */
export const rejectStudentRequest = async (requestId, reason = "") => {
  const { data } = await api.put(`/student-requests/${requestId}/reject`, { reason });
  return data;
};
