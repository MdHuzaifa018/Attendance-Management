import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import { getCache, setCache } from "../utils/cache.js";

/**
 * getSystemOverview
 * Returns high-level metrics for the admin dashboard.
 */
export const getSystemOverview = async (sessionId) => {
  const cacheKey = `system_overview_${sessionId || "all"}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) return cachedData;

  // We need to count Enrollments for the given session instead of global students
  const sessionMatch = sessionId ? { academicSession: new mongoose.Types.ObjectId(sessionId) } : {};
  const attendanceMatch = sessionId ? { academicSession: new mongoose.Types.ObjectId(sessionId) } : {};

  const [studentCount, teacherCount, classCount] = await Promise.all([
    mongoose.model("Enrollment").countDocuments({ ...sessionMatch, status: { $in: ["active", "year_repeat"] } }),
    Teacher.countDocuments({ isActive: true }),
    Class.countDocuments({ ...sessionMatch, isActive: true }),
  ]);

  // 1. System-wide attendance stats
  const attStats = await Attendance.aggregate([
    { $match: attendanceMatch },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        presentRecords: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
  ]);

  const totalRecords = attStats[0]?.totalRecords || 0;
  const presentRecords = attStats[0]?.presentRecords || 0;
  const absentRecords = totalRecords - presentRecords;
  let overallPercent = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  // 2. Today's attendance stats
  const today = new Date();
  const startOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const endOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

  const todayStatsAgg = await Attendance.aggregate([
    {
      $match: {
        ...attendanceMatch,
        date: { $gte: startOfToday, $lte: endOfToday },
      },
    },
    {
      $group: {
        _id: null,
        totalToday: { $sum: 1 },
        presentToday: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
        classesSet: { $addToSet: "$class" },
        sessionsSet: {
          $addToSet: {
            class: "$class",
            subject: "$subject",
            session: "$session",
          },
        },
      },
    },
  ]);

  const totalToday = todayStatsAgg[0]?.totalToday || 0;
  const presentToday = todayStatsAgg[0]?.presentToday || 0;
  const absentToday = totalToday - presentToday;
  const todayPercent = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;
  const activeClassesToday = todayStatsAgg[0]?.classesSet?.length || 0;
  const todaySessionsCount = todayStatsAgg[0]?.sessionsSet?.length || 0;

  // 3. Class-wise performance breakdown (for analyst comparative bar chart)
  const classBreakdown = await Attendance.aggregate([
    { $match: attendanceMatch },
    {
      $group: {
        _id: "$class",
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "_id",
        as: "classDoc",
      },
    },
    { $unwind: "$classDoc" },
    {
      $project: {
        _id: 1,
        name: "$classDoc.name",
        code: "$classDoc.code",
        total: 1,
        present: 1,
        rate: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1] },
          ],
        },
      },
    },
    { $sort: { rate: -1 } },
    { $limit: 6 },
  ]);

  // 4. Students at-risk (< 75% attendance)
  const atRiskAgg = await Attendance.aggregate([
    { $match: attendanceMatch },
    {
      $group: {
        _id: "$student",
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        percent: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] },
          ],
        },
      },
    },
    { $match: { percent: { $lt: 75 } } },
    { $count: "count" },
  ]);
  const atRiskCount = atRiskAgg[0]?.count || 0;

  const result = {
    studentCount,
    teacherCount,
    classCount,
    overallPercent,
    activeClassesToday,
    todaySessionsCount,
    totalRecords,
    presentRecords,
    absentRecords,
    atRiskCount,
    todayStats: {
      total: totalToday,
      present: presentToday,
      absent: absentToday,
      percent: todayPercent,
    },
    classBreakdown,
  };

  setCache(cacheKey, result, 60); // cache for 60 seconds
  return result;
};

/**
 * getAttendanceTrends
 * Returns daily attendance percentages for the last N days.
 */
export const getAttendanceTrends = async (days = 7) => {
  const cacheKey = `attendance_trends_${days}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) return cachedData;

  const cutoffDate = new Date();
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - (days - 1));
  cutoffDate.setUTCHours(0, 0, 0, 0);

  const trends = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: cutoffDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
          dateString: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
        totalRecords: { $sum: 1 },
        presentRecords: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
    {
      $sort: { "_id.dateString": 1 },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.dateString",
        percent: {
          $cond: [
            { $eq: ["$totalRecords", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$presentRecords", "$totalRecords"] }, 100] }, 0] },
          ],
        },
        total: "$totalRecords",
      },
    },
  ]);

  // Fill in missing days with 0 data (optional but good for charts)
  const resultMap = new Map();
  trends.forEach((t) => resultMap.set(t.date, t));

  const finalTrends = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    const dateStr = d.toISOString().split("T")[0];

    if (resultMap.has(dateStr)) {
      finalTrends.push(resultMap.get(dateStr));
    } else {
      finalTrends.push({ date: dateStr, percent: 0, total: 0 });
    }
  }

  setCache(cacheKey, finalTrends, 300); // cache for 5 mins
  return finalTrends;
};

/**
 * getDetailedReport
 * Returns aggregated attendance per student per subject based on filters.
 */
export const getDetailedReport = async (filters) => {
  const { departmentId, classId, subjectId, startDate, endDate } = filters;

  const matchStage = {};

  if (classId) {
    matchStage.class = new mongoose.Types.ObjectId(classId);
  }
  if (subjectId) {
    matchStage.subject = new mongoose.Types.ObjectId(subjectId);
  }

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) {
      const [y, m, d] = startDate.split("-").map(Number);
      matchStage.date.$gte = new Date(Date.UTC(y, m - 1, d));
    }
    if (endDate) {
      const [y, m, d] = endDate.split("-").map(Number);
      matchStage.date.$lte = new Date(Date.UTC(y, m - 1, d));
    }
  }

  // Pipeline
  const pipeline = [];

  // Match initial attendance records
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Group by student and subject
  pipeline.push({
    $group: {
      _id: { student: "$student", subject: "$subject", class: "$class" },
      totalConducted: { $sum: 1 },
      present: {
        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
      },
      absent: {
        $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
      },
    },
  });

  // Lookup Student to get Name, Roll No, Department
  pipeline.push({
    $lookup: {
      from: "students",
      localField: "_id.student",
      foreignField: "_id",
      as: "studentDoc",
    },
  });
  pipeline.push({ $unwind: "$studentDoc" });

  // If department filter is applied, match it here
  if (departmentId) {
    pipeline.push({
      $match: {
        "studentDoc.department": new mongoose.Types.ObjectId(departmentId),
      },
    });
  }

  // Lookup User to get Student Name
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "studentDoc.user",
      foreignField: "_id",
      as: "userDoc",
    },
  });
  pipeline.push({ $unwind: "$userDoc" });

  // Lookup Class
  pipeline.push({
    $lookup: {
      from: "classes",
      localField: "_id.class",
      foreignField: "_id",
      as: "classDoc",
    },
  });
  pipeline.push({ $unwind: "$classDoc" });

  // Lookup Subject
  pipeline.push({
    $lookup: {
      from: "subjects",
      localField: "_id.subject",
      foreignField: "_id",
      as: "subjectDoc",
    },
  });
  pipeline.push({ $unwind: "$subjectDoc" });

  // Project final fields
  pipeline.push({
    $project: {
      _id: 0,
      studentName: "$userDoc.name",
      rollNo: "$studentDoc.rollNo",
      className: "$classDoc.name",
      subjectName: "$subjectDoc.name",
      subjectCode: "$subjectDoc.code",
      totalConducted: 1,
      present: 1,
      absent: 1,
      percent: {
        $cond: [
          { $eq: ["$totalConducted", 0] },
          0,
          { $round: [{ $multiply: [{ $divide: ["$present", "$totalConducted"] }, 100] }, 0] },
        ],
      },
    },
  });

  // Sort by class, then rollNo, then subject
  pipeline.push({
    $sort: { className: 1, rollNo: 1, subjectName: 1 },
  });

  const reportData = await Attendance.aggregate(pipeline);
  return reportData;
};

/**
 * getStudentDetailedReport
 * Fetches attendance stats for a specific student for all subjects in their class.
 */
export const getStudentDetailedReport = async (studentId) => {
  const student = await Student.findById(studentId).lean();
  if (!student) {
    throw new Error("Student not found");
  }

  const activeEnrollment = await mongoose.model("Enrollment").findOne({
    student: studentId,
    status: { $in: ["active", "year_repeat"] }
  });

  if (!activeEnrollment) {
    throw new Error("Active enrollment not found for student");
  }

  // Find all active subjects for this student's class
  const subjects = await Subject.find({ class: activeEnrollment.class, isActive: true })
    .select("name code _id")
    .lean();

  // Get attendance grouped by subject
  const attendanceAgg = await Attendance.aggregate([
    {
      $match: { student: new mongoose.Types.ObjectId(studentId) },
    },
    {
      $group: {
        _id: "$subject",
        totalConducted: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
        },
      },
    },
  ]);

  const attendanceMap = new Map();
  attendanceAgg.forEach((att) => {
    attendanceMap.set(att._id.toString(), att);
  });

  const result = subjects.map((sub) => {
    const stats = attendanceMap.get(sub._id.toString()) || {
      totalConducted: 0,
      present: 0,
      absent: 0,
    };

    let percent = 0;
    if (stats.totalConducted > 0) {
      percent = Math.round((stats.present / stats.totalConducted) * 100);
    }

    return {
      subjectId: sub._id,
      subjectName: sub.name,
      subjectCode: sub.code,
      totalConducted: stats.totalConducted,
      present: stats.present,
      absent: stats.absent,
      percent,
    };
  });

  return result;
};

/**
 * getAtRiskStudentsDetails
 * Returns a list of students with overall attendance < 75%
 */
export const getAtRiskStudentsDetails = async (sessionId) => {
  const attendanceMatch = sessionId ? { academicSession: new mongoose.Types.ObjectId(sessionId) } : {};

  const atRiskAgg = await Attendance.aggregate([
    { $match: attendanceMatch },
    {
      $group: {
        _id: "$student",
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 1,
        total: 1,
        present: 1,
        percent: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] },
          ],
        },
      },
    },
    { $match: { percent: { $lt: 75 } } },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "studentDoc",
      },
    },
    { $unwind: "$studentDoc" },
    {
      $lookup: {
        from: "enrollments",
        let: { studentId: "$_id", session: sessionId ? new mongoose.Types.ObjectId(sessionId) : null },
        pipeline: [
          { $match: { $expr: { $and: [
            { $eq: ["$student", "$$studentId"] },
            { $or: [ { $eq: ["$$session", null] }, { $eq: ["$academicSession", "$$session"] } ] }
          ] } } },
          { $limit: 1 }
        ],
        as: "enrollmentDoc",
      }
    },
    { $unwind: { path: "$enrollmentDoc", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "studentDoc.user",
        foreignField: "_id",
        as: "userDoc",
      },
    },
    { $unwind: "$userDoc" },
    {
      $lookup: {
        from: "classes",
        localField: "studentDoc.class",
        foreignField: "_id",
        as: "classDoc",
      },
    },
    { $unwind: { path: "$classDoc", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: "$userDoc.name",
        rollNo: { $ifNull: ["$enrollmentDoc.rollNo", "$studentDoc.rollNo"] },
        className: "$classDoc.name",
        total: 1,
        present: 1,
        percent: 1,
      },
    },
    { $sort: { percent: 1 } },
  ]);

  return atRiskAgg;
};
