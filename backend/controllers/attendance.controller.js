import * as attendanceService from "../services/attendance.service.js";

/**
 * Attendance Controller
 * Express 5 async error handling forwarding to errorHandler middleware.
 */

// GET /api/attendance/sheet?classId=&subjectId=&date=&session=
export const getAttendanceSheet = async (req, res) => {
  const { classId, subjectId, date, session } = req.validatedQuery || req.query;

  const result = await attendanceService.getAttendanceSheet({
    classId,
    subjectId,
    date,
    session,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};

// POST /api/attendance/mark
export const submitAttendance = async (req, res) => {
  const { classId, subjectId, date, session, records, updateIfExists } = req.body;

  const result = await attendanceService.markAttendance({
    classId,
    subjectId,
    date,
    session,
    records,
    updateIfExists,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(201).json({ success: true, ...result });
};

// GET /api/attendance/assigned-subjects
export const getAssignedSubjects = async (req, res) => {
  const result = await attendanceService.getTeacherAssignedSubjects({
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};

// POST /api/attendance/bulk-override
export const bulkOverrideStudentAttendance = async (req, res) => {
  const { studentId, classId, subjects } = req.body;
  
  const result = await attendanceService.bulkOverrideStudentAttendance({
    studentId,
    classId,
    subjects,
    userId: req.user._id,
    userRole: req.user.role,
  });

  res.status(200).json({ success: true, ...result });
};
