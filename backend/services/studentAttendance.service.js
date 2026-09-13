import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";

/**
 * getStudentAttendanceSummary
 * Returns per-subject attendance stats for the logged-in student.
 * Includes: subject name/code, total conducted classes, attended classes, percentage, status.
 */
export const getStudentAttendanceSummary = async ({ userId }) => {
  // Resolve student record from user ID
  const studentDoc = await Student.findOne({ user: userId })
    .populate("class", "name code semester academicYear")
    .populate("department", "name code")
    .lean();

  if (!studentDoc) {
    const err = new Error("Student record not found for this account");
    err.statusCode = 404;
    throw err;
  }

  // Get all subjects in the student's class
  const subjects = await Subject.find({
    class: studentDoc.class._id,
    isActive: true,
  })
    .populate({
      path: "teacher",
      select: "employeeId designation",
      populate: { path: "user", select: "name" },
    })
    .sort({ code: 1 })
    .lean();

  // Aggregate attendance per subject for this student
  const attendanceAgg = await Attendance.aggregate([
    {
      $match: {
        student: studentDoc._id,
      },
    },
    {
      $group: {
        _id: "$subject",
        attended: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
        },
        lastSeen: { $max: "$date" },
      },
    },
  ]);

  const attendanceMap = new Map();
  attendanceAgg.forEach((a) => {
    attendanceMap.set(String(a._id), a);
  });

  // Combine subjects with attendance data
  const subjectSummaries = subjects.map((subj) => {
    const att = attendanceMap.get(String(subj._id)) || {
      attended: 0,
      absent: 0,
      lastSeen: null,
    };
    const totalSessions = subj.totalClasses || 0;
    const totalDays = subj.totalDays || 0;
    const attended = att.attended;
    const absent = att.absent;
    const percent = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

    // Status: ≥75% green, 50–74% amber, <50% red
    const status = percent >= 75 ? "good" : percent >= 50 ? "warning" : "critical";

    let classesNeeded = 0;
    if (percent < 75 && totalSessions > 0) {
      // Solve: (attended + x) / (totalSessions + x) >= 0.75
      // attended + x >= 0.75 * totalSessions + 0.75x
      // 0.25x >= 0.75 * totalSessions - attended
      const needed = 0.75 * totalSessions - attended;
      classesNeeded = needed > 0 ? Math.ceil(needed / 0.25) : 0;
    }

    let canMiss = 0;
    if (percent >= 75) {
      // Solve: (attended) / (totalSessions + x) >= 0.75
      // attended >= 0.75 * totalSessions + 0.75x
      // 0.75x <= attended - 0.75 * totalSessions
      const extra = attended - 0.75 * totalSessions;
      canMiss = extra > 0 ? Math.floor(extra / 0.75) : 0;
    }

    return {
      _id: subj._id,
      name: subj.name,
      code: subj.code,
      teacher: subj.teacher?.user?.name || "Not assigned",
      totalSessions,
      totalDays,
      attended,
      absent,
      percent,
      status,
      classesNeeded,
      canMiss,
      lastSeen: att.lastSeen,
    };
  });

  // Overall totals
  const totalSessions = subjectSummaries.reduce((s, x) => s + x.totalSessions, 0);
  const totalDays = subjectSummaries.reduce((s, x) => s + x.totalDays, 0);
  const totalAttended = subjectSummaries.reduce((s, x) => s + x.attended, 0);
  const overallPercent = totalSessions > 0 ? Math.round((totalAttended / totalSessions) * 100) : 0;
  const overallStatus = overallPercent >= 75 ? "good" : overallPercent >= 50 ? "warning" : "critical";

  return {
    student: {
      _id: studentDoc._id,
      name: studentDoc.user?.name,
      rollNo: studentDoc.rollNo,
      fatherName: studentDoc.fatherName,
      duration: studentDoc.duration,
      phone: studentDoc.phone,
      class: studentDoc.class,
      department: studentDoc.department,
      admissionYear: studentDoc.admissionYear,
    },
    overview: {
      totalSessions,
      totalDays,
      totalAttended,
      totalAbsent: totalSessions - totalAttended,
      overallPercent,
      overallStatus,
      subjectCount: subjectSummaries.length,
    },
    subjects: subjectSummaries,
  };
};

/**
 * getStudentAttendanceTimeline
 * Returns date-wise attendance records for a specific subject (or all subjects)
 * for the logged-in student — used for the history/timeline view.
 */
export const getStudentAttendanceTimeline = async ({
  userId,
  subjectId,
  startDate,
  endDate,
  page = 1,
  limit = 30,
}) => {
  const studentDoc = await Student.findOne({ user: userId }).lean();
  if (!studentDoc) {
    const err = new Error("Student record not found");
    err.statusCode = 404;
    throw err;
  }

  const match = { student: studentDoc._id };
  if (subjectId) match.subject = new mongoose.Types.ObjectId(subjectId);
  if (startDate || endDate) {
    match.date = {};
    if (startDate) {
      const [y, m, d] = startDate.split("-").map(Number);
      match.date.$gte = new Date(Date.UTC(y, m - 1, d));
    }
    if (endDate) {
      const [y, m, d] = endDate.split("-").map(Number);
      match.date.$lte = new Date(Date.UTC(y, m - 1, d));
    }
  }

  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments(match);

  const records = await Attendance.find(match)
    .populate("subject", "name code")
    .populate("class", "name code")
    .sort({ date: -1, session: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    records: records.map((r) => ({
      _id: r._id,
      subject: r.subject,
      class: r.class,
      date: r.date,
      session: r.session,
      status: r.status,
      markedAt: r.markedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    studentId: studentDoc._id,
  };
};
