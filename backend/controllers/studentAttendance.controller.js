import * as studentAttService from "../services/studentAttendance.service.js";

/**
 * Student Attendance Controller
 * Endpoints for the student's own attendance summary and timeline.
 */

// GET /api/student-attendance/summary
export const getAttendanceSummary = async (req, res) => {
  const result = await studentAttService.getStudentAttendanceSummary({
    userId: req.user._id,
  });
  res.status(200).json({ success: true, ...result });
};

// GET /api/student-attendance/timeline
export const getAttendanceTimeline = async (req, res) => {
  const { subjectId, startDate, endDate, page, limit } =
    req.validatedQuery || req.query;

  const result = await studentAttService.getStudentAttendanceTimeline({
    userId: req.user._id,
    subjectId,
    startDate,
    endDate,
    page: Number(page) || 1,
    limit: Number(limit) || 30,
  });

  res.status(200).json({ success: true, ...result });
};
