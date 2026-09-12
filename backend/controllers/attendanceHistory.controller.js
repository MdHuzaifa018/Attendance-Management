import * as historyService from "../services/attendanceHistory.service.js";

/**
 * Attendance History Controller
 * Handles history browsing, session detail view, single-record correction, and audit log.
 */

// GET /api/attendance/history?classId=&subjectId=&startDate=&endDate=&session=&page=&limit=
export const listSessions = async (req, res) => {
  const { classId, subjectId, teacherId, startDate, endDate, session, page, limit } =
    req.validatedQuery || req.query;

  const result = await historyService.getAttendanceSessions({
    classId,
    subjectId,
    teacherId,
    startDate,
    endDate,
    session,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/attendance/history/session?classId=&subjectId=&date=&session=
export const getSessionDetail = async (req, res) => {
  const { classId, subjectId, date, session } = req.validatedQuery || req.query;

  const result = await historyService.getSessionDetail({
    classId,
    subjectId,
    date,
    session,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};

// PATCH /api/attendance/history/correct
export const correctRecord = async (req, res) => {
  const { attendanceId, newStatus, reason } = req.body;

  const result = await historyService.correctAttendanceRecord({
    attendanceId,
    newStatus,
    reason,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/attendance/history/audit — admin only
export const getAuditLog = async (req, res) => {
  const { classId, subjectId, startDate, endDate, page, limit } =
    req.validatedQuery || req.query;

  const result = await historyService.getAuditLog({
    classId,
    subjectId,
    startDate,
    endDate,
    page: Number(page) || 1,
    limit: Number(limit) || 30,
  });

  res.status(200).json({ success: true, ...result });
};
