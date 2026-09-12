import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";

/**
 * getSystemOverview
 * Returns high-level metrics for the admin dashboard.
 */
export const getSystemOverview = async () => {
  const [studentCount, teacherCount, classCount] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
    Class.countDocuments({ isActive: true }),
  ]);

  // System-wide attendance stats
  const attStats = await Attendance.aggregate([
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

  let overallPercent = 0;
  if (attStats.length > 0 && attStats[0].totalRecords > 0) {
    overallPercent = Math.round(
      (attStats[0].presentRecords / attStats[0].totalRecords) * 100
    );
  }

  // Active classes today
  const today = new Date();
  const startOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const endOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

  const activeClassesAgg = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: startOfToday, $lte: endOfToday },
      },
    },
    {
      $group: {
        _id: "$class",
      },
    },
  ]);
  const activeClassesToday = activeClassesAgg.length;

  return {
    studentCount,
    teacherCount,
    classCount,
    overallPercent,
    activeClassesToday,
  };
};

/**
 * getAttendanceTrends
 * Returns daily attendance percentages for the last N days.
 */
export const getAttendanceTrends = async (days = 7) => {
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
