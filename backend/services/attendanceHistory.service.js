import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import { normalizeDate } from "./attendance.service.js";
import mongoose from "mongoose";

/**
 * getAttendanceSessions
 * Returns a paginated list of distinct (class, subject, date, session) tuples
 * that have attendance records, with aggregate stats per session.
 * Supports filtering by classId, subjectId, teacherId, date range, session.
 */
export const getAttendanceSessions = async ({
  classId,
  subjectId,
  teacherId,
  startDate,
  endDate,
  session,
  page = 1,
  limit = 20,
  userId,
  userRole,
}) => {
  const matchStage = {};

  // Teachers can only see their own subjects
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc) return { sessions: [], total: 0, page, limit };
    matchStage.teacher = teacherDoc._id;
  } else if (teacherId) {
    matchStage.teacher = teacherId;
  }

  if (classId) matchStage.class = classId;
  if (subjectId) matchStage.subject = subjectId;
  if (session) matchStage.session = session;

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = normalizeDate(startDate);
    if (endDate) matchStage.date.$lte = normalizeDate(endDate);
  }

  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          class: "$class",
          subject: "$subject",
          date: "$date",
          session: "$session",
          teacher: "$teacher",
        },
        totalStudents: { $sum: 1 },
        presentCount: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
        absentCount: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
        },
        markedAt: { $max: "$markedAt" },
        hasEdits: { $max: { $cond: [{ $gt: [{ $size: { $ifNull: ["$editHistory", []] } }, 0] }, 1, 0] } },
      },
    },
    { $sort: { "_id.date": -1, "_id.session": 1 } },
    {
      $facet: {
        total: [{ $count: "count" }],
        sessions: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "classes",
              localField: "_id.class",
              foreignField: "_id",
              as: "classDoc",
            },
          },
          {
            $lookup: {
              from: "subjects",
              localField: "_id.subject",
              foreignField: "_id",
              as: "subjectDoc",
            },
          },
          {
            $lookup: {
              from: "teachers",
              localField: "_id.teacher",
              foreignField: "_id",
              as: "teacherDoc",
            },
          },
          {
            $unwind: { path: "$classDoc", preserveNullAndEmptyArrays: true },
          },
          {
            $unwind: { path: "$subjectDoc", preserveNullAndEmptyArrays: true },
          },
          {
            $unwind: { path: "$teacherDoc", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "users",
              localField: "teacherDoc.user",
              foreignField: "_id",
              as: "teacherUser",
            },
          },
          {
            $unwind: { path: "$teacherUser", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              _id: 0,
              class: {
                _id: "$classDoc._id",
                name: "$classDoc.name",
                code: "$classDoc.code",
                semester: "$classDoc.semester",
              },
              subject: {
                _id: "$subjectDoc._id",
                name: "$subjectDoc.name",
                code: "$subjectDoc.code",
              },
              teacher: {
                _id: "$teacherDoc._id",
                name: "$teacherUser.name",
                employeeId: "$teacherDoc.employeeId",
              },
              date: "$_id.date",
              session: "$_id.session",
              totalStudents: 1,
              presentCount: 1,
              absentCount: 1,
              attendancePercent: {
                $cond: [
                  { $gt: ["$totalStudents", 0] },
                  {
                    $round: [
                      { $multiply: [{ $divide: ["$presentCount", "$totalStudents"] }, 100] },
                      1,
                    ],
                  },
                  0,
                ],
              },
              markedAt: 1,
              hasEdits: { $gt: ["$hasEdits", 0] },
            },
          },
        ],
      },
    },
  ];

  const [result] = await Attendance.aggregate(pipeline);
  const total = result.total?.[0]?.count || 0;

  return {
    sessions: result.sessions || [],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * getSessionDetail
 * Returns all student records for one specific attendance session with
 * their full edit history.
 */
export const getSessionDetail = async ({
  classId,
  subjectId,
  date,
  session = "regular",
  userId,
  userRole,
}) => {
  const normalizedDate = normalizeDate(date);

  // Teacher authorization — can only view their own sessions
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc) {
      const err = new Error("Teacher record not found");
      err.statusCode = 403;
      throw err;
    }

    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc || String(subjectDoc.teacher) !== String(teacherDoc._id)) {
      const err = new Error("Access denied: not the assigned teacher for this subject");
      err.statusCode = 403;
      throw err;
    }
  }

  const records = await Attendance.find({
    class: classId,
    subject: subjectId,
    date: normalizedDate,
    session,
  })
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate({
      path: "editHistory.changedBy",
      select: "name email role",
    })
    .lean();

  // Sort in JS because populating and sorting on string fields doesn't work correctly in MongoDB
  records.sort((a, b) => {
    const rollA = a.student?.rollNo || "";
    const rollB = b.student?.rollNo || "";
    return rollA.localeCompare(rollB, undefined, { numeric: true });
  });

  // Parallel lookups for metadata and stats
  const [cls, subjectDoc, statsAggr] = await Promise.all([
    Class.findById(classId).lean(),
    Subject.findById(subjectId).lean(),
    Attendance.aggregate([
      { $match: { class: new mongoose.Types.ObjectId(classId), subject: new mongoose.Types.ObjectId(subjectId) } },
      {
        $group: {
          _id: "$student",
          totalAttended: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          todayAttended: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "present"] },
                    { $eq: ["$date", normalizedDate] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const statsMap = new Map();
  statsAggr.forEach((stat) => {
    statsMap.set(String(stat._id), {
      totalAttended: stat.totalAttended,
      todayAttended: stat.todayAttended,
    });
  });

  const studentRows = records.map((r) => {
    const sId = String(r.student._id);
    const stats = statsMap.get(sId) || { totalAttended: 0, todayAttended: 0 };
    return {
      _id: r._id,
      student: {
        _id: r.student._id,
        rollNo: r.student.rollNo,
        name: r.student.user?.name || r.student.name,
        fatherName: r.student.fatherName,
      },
      status: r.status,
      markedAt: r.markedAt,
      editHistory: r.editHistory || [],
      wasEdited: (r.editHistory || []).length > 0,
      totalAttended: stats.totalAttended,
      todayAttended: stats.todayAttended,
    };
  });

  return {
    class: cls
      ? { _id: cls._id, name: cls.name, code: cls.code, semester: cls.semester }
      : null,
    subject: subjectDoc
      ? { _id: subjectDoc._id, name: subjectDoc.name, code: subjectDoc.code }
      : null,
    date: normalizedDate.toISOString().slice(0, 10),
    session,
    students: studentRows,
    summary: {
      total: studentRows.length,
      present: studentRows.filter((s) => s.status === "present").length,
      absent: studentRows.filter((s) => s.status === "absent").length,
    },
  };
};

/**
 * correctAttendanceRecord
 * Authorized correction of a single student's attendance status.
 * Appends the change to editHistory for a full audit trail.
 */
export const correctAttendanceRecord = async ({
  attendanceId,
  newStatus,
  reason,
  userId,
  userRole,
}) => {
  const record = await Attendance.findById(attendanceId).populate("subject");
  if (!record) {
    const err = new Error("Attendance record not found");
    err.statusCode = 404;
    throw err;
  }

  // Teacher can only correct records for their own subjects
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc || String(record.subject.teacher) !== String(teacherDoc._id)) {
      const err = new Error("Access denied: You can only correct attendance for your own subjects");
      err.statusCode = 403;
      throw err;
    }
  }

  if (record.status === newStatus) {
    const err = new Error(`Status is already "${newStatus}" — no change needed`);
    err.statusCode = 400;
    throw err;
  }

  const previousStatus = record.status;

  // Append to audit trail
  record.editHistory.push({
    changedBy: userId,
    changedByRole: userRole,
    previousStatus,
    newStatus,
    reason: reason || null,
    changedAt: new Date(),
  });

  record.status = newStatus;
  record.markedAt = new Date();
  await record.save();

  return {
    message: `Attendance corrected: ${previousStatus} → ${newStatus}`,
    attendanceId: record._id,
    previousStatus,
    newStatus,
    editHistoryLength: record.editHistory.length,
  };
};

/**
 * getAuditLog
 * Returns all edited attendance records across the system (admin only),
 * ordered by most recently edited.
 */
export const getAuditLog = async ({ page = 1, limit = 30, classId, subjectId, startDate, endDate }) => {
  const match = { "editHistory.0": { $exists: true } };

  if (classId) match.class = classId;
  if (subjectId) match.subject = subjectId;
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = normalizeDate(startDate);
    if (endDate) match.date.$lte = normalizeDate(endDate);
  }

  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments(match);

  const records = await Attendance.find(match)
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate({ path: "class", select: "name code semester" })
    .populate({ path: "subject", select: "name code" })
    .populate({
      path: "editHistory.changedBy",
      select: "name email role",
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    records: records.map((r) => ({
      _id: r._id,
      student: {
        _id: r.student._id,
        name: r.student.user?.name || r.student.name,
        rollNo: r.student.rollNo,
      },
      class: r.class,
      subject: r.subject,
      date: r.date,
      session: r.session,
      currentStatus: r.status,
      editHistory: r.editHistory,
      lastEditAt: r.editHistory[r.editHistory.length - 1]?.changedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
