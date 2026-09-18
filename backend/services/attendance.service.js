import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { clearCache } from "../utils/cache.js";

/**
 * Normalizes any date input string to midnight UTC to prevent timezone skew.
 */
export const normalizeDate = (dateInput) => {
  const dateStr =
    typeof dateInput === "string"
      ? dateInput.slice(0, 10)
      : dateInput.toISOString().slice(0, 10);
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/**
 * getAttendanceSheet
 * Loads all enrolled students in a class and checks if attendance has already
 * been marked for the given class, subject, date, and session.
 */
export const getAttendanceSheet = async ({
  classId,
  subjectId,
  date,
  session = "regular",
  userId,
  userRole,
}) => {
  const [cls, subject] = await Promise.all([
    Class.findById(classId).populate("department", "name code"),
    Subject.findById(subjectId).populate("teacher", "employeeId designation user"),
  ]);

  if (!cls) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  if (!subject) {
    const err = new Error("Subject not found");
    err.statusCode = 404;
    throw err;
  }

  // Ensure subject is attached to this class
  if (String(subject.class) !== String(classId)) {
    const err = new Error(`Subject "${subject.code}" is not registered under class "${cls.code}"`);
    err.statusCode = 400;
    throw err;
  }

  // Teacher authorization check: teacher can only load their assigned subjects
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc || String(subject.teacher._id || subject.teacher) !== String(teacherDoc._id)) {
      const err = new Error("Access denied: You are not the assigned teacher for this subject");
      err.statusCode = 403;
      throw err;
    }
  }

  const normalizedDate = normalizeDate(date);

  // Fetch enrolled students in this class, sorted by roll number
  const students = await Student.find({ class: classId })
    .populate("user", "name email")
    .sort({ rollNo: 1 })
    .lean();

  // Check if attendance records already exist for this class + subject + date + session
  const existingRecords = await Attendance.find({
    class: classId,
    subject: subjectId,
    date: normalizedDate,
    session,
  }).lean();

  const existingMap = new Map();
  existingRecords.forEach((rec) => {
    existingMap.set(String(rec.student), rec.status);
  });

  const isMarked = existingRecords.length > 0;

  // Aggregate student stats (total attended and today attended)
  const statsAggr = await Attendance.aggregate([
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
  ]);

  const statsMap = new Map();
  statsAggr.forEach((stat) => {
    statsMap.set(String(stat._id), {
      totalAttended: stat.totalAttended,
      todayAttended: stat.todayAttended,
    });
  });

  // Format student records for the frontend attendance table
  const studentRows = students.map((s) => {
    const sId = String(s._id);
    const stats = statsMap.get(sId) || { totalAttended: 0, todayAttended: 0 };
    return {
      _id: s._id,
      rollNo: s.rollNo,
      name: s.user?.name || s.name,
      email: s.user?.email,
      fatherName: s.fatherName,
      status: existingMap.get(sId) || "present", // default to present for new sheets
      isPreviouslyMarked: existingMap.has(sId),
      totalAttended: stats.totalAttended,
      todayAttended: stats.todayAttended,
    };
  });

  return {
    class: {
      _id: cls._id,
      name: cls.name,
      code: cls.code,
      semester: cls.semester,
      department: cls.department,
    },
    subject: {
      _id: subject._id,
      name: subject.name,
      code: subject.code,
      totalClasses: subject.totalClasses,
    },
    date: normalizedDate.toISOString().slice(0, 10),
    session,
    isMarked,
    existingCount: existingRecords.length,
    totalStudents: students.length,
    students: studentRows,
  };
};

/**
 * markAttendance
 * Submits bulk attendance records atomically using bulkWrite upserts.
 * Increments Subject.totalClasses if this is a brand new session.
 */
export const markAttendance = async ({
  classId,
  subjectId,
  date,
  session = "regular",
  records,
  updateIfExists = false,
  userId,
  userRole,
}) => {
  const [cls, subject] = await Promise.all([
    Class.findById(classId),
    Subject.findById(subjectId),
  ]);

  if (!cls) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  if (!subject) {
    const err = new Error("Subject not found");
    err.statusCode = 404;
    throw err;
  }

  if (String(subject.class) !== String(classId)) {
    const err = new Error(`Subject "${subject.code}" is not registered under class "${cls.code}"`);
    err.statusCode = 400;
    throw err;
  }

  // Resolve assigned teacher
  let resolvedTeacherId;
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc || String(subject.teacher) !== String(teacherDoc._id)) {
      const err = new Error("Access denied: You are not the assigned teacher for this subject");
      err.statusCode = 403;
      throw err;
    }
    resolvedTeacherId = teacherDoc._id;
  } else {
    // Admin user: use subject's assigned teacher ID
    resolvedTeacherId = subject.teacher;
  }

  const normalizedDate = normalizeDate(date);
  const dateStr = normalizedDate.toISOString().slice(0, 10);

  // Check if session was previously recorded
  const existingCount = await Attendance.countDocuments({
    class: classId,
    subject: subjectId,
    date: normalizedDate,
    session,
  });

  if (existingCount > 0 && !updateIfExists) {
    const err = new Error(
      `Attendance for "${subject.code}" on ${dateStr} (${session}) has already been recorded. Confirm update to overwrite.`
    );
    err.statusCode = 409;
    err.alreadyMarked = true;
    throw err;
  }

  // Build atomic bulkWrite operations with compound key filter
  const operations = records.map((rec) => ({
    updateOne: {
      filter: {
        student: rec.studentId,
        class: classId,
        subject: subjectId,
        date: normalizedDate,
        session,
      },
      update: {
        $set: {
          teacher: resolvedTeacherId,
          status: rec.status,
          markedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  // Check if this is the first session marked on this specific date for this subject
  const existingDayCount = await Attendance.countDocuments({
    class: classId,
    subject: subjectId,
    date: normalizedDate,
  });

  await Attendance.bulkWrite(operations);

  // If this was a brand new session, increment conducted class count on the subject
  const isNewSession = existingCount === 0;
  const isNewDay = existingDayCount === 0;

  if (isNewSession || isNewDay) {
    const inc = {};
    if (isNewSession) inc.totalClasses = 1;
    if (isNewDay) inc.totalDays = 1;
    
    await Subject.findByIdAndUpdate(subjectId, { $inc: inc });
  }

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;

  return {
    message: isNewSession
      ? "Attendance marked successfully"
      : "Attendance records updated successfully",
    isNewSession,
    totalMarked: records.length,
    presentCount,
    absentCount,
    date: dateStr,
    session,
  };
};

/**
 * getTeacherAssignedSubjects
 * Returns subjects assigned to the current user (if teacher) or all active subjects (if admin).
 */
export const getTeacherAssignedSubjects = async ({ userId, userRole }) => {
  if (userRole === "teacher") {
    const teacherDoc = await Teacher.findOne({ user: userId });
    if (!teacherDoc) {
      return { teacher: null, subjects: [] };
    }

    const subjects = await Subject.find({
      teacher: teacherDoc._id,
      isActive: true,
    })
      .populate("class", "name code semester academicYear")
      .sort({ code: 1 })
      .lean();

    return { teacher: teacherDoc, subjects };
  }

  // If Admin: return all active subjects with class and teacher populated
  const subjects = await Subject.find({ isActive: true })
    .populate("class", "name code semester academicYear")
    .populate({
      path: "teacher",
      select: "employeeId designation user",
      populate: { path: "user", select: "name email" },
    })
    .sort({ code: 1 })
    .lean();

  return { teacher: null, subjects };
};

/**
 * bulkOverrideStudentAttendance
 * Wipes a student's attendance history for specified subjects and generates 
 * mock records to match the provided totalConducted and totalAttended numbers.
 */
export const bulkOverrideStudentAttendance = async ({
  studentId,
  classId,
  subjects, // Array of { subjectId, totalConducted, totalAttended }
  userId,
  userRole,
}) => {
  if (userRole !== "admin") {
    const err = new Error("Access denied: Only admins can perform bulk overrides");
    err.statusCode = 403;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student || String(student.class) !== String(classId)) {
    const err = new Error("Invalid student or class mismatch");
    err.statusCode = 400;
    throw err;
  }

  const operationsCount = { deleted: 0, inserted: 0 };
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Process each subject override
  for (const sub of subjects) {
    const { subjectId, totalConducted, totalAttended } = sub;

    if (totalAttended > totalConducted) {
      const err = new Error(`Attended classes cannot exceed conducted classes for subject ${subjectId}`);
      err.statusCode = 400;
      throw err;
    }

    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc || String(subjectDoc.class) !== String(classId)) {
      continue; // Skip invalid subjects
    }

    // 1. Wipe existing attendance for this student + subject
    const deleteResult = await Attendance.deleteMany({
      student: studentId,
      class: classId,
      subject: subjectId,
    });
    operationsCount.deleted += deleteResult.deletedCount;

    // 2. Generate mock records
    if (totalConducted > 0) {
      const mockRecords = [];
      for (let i = 0; i < totalConducted; i++) {
        // Backdate records by `i + 1` days to avoid future dates and duplicate keys
        const mockDate = new Date(today.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
        
        mockRecords.push({
          student: studentId,
          class: classId,
          subject: subjectId,
          teacher: subjectDoc.teacher,
          date: mockDate,
          session: "Bulk-Override",
          status: i < totalAttended ? "present" : "absent",
          markedAt: new Date(),
        });
      }

      const insertResult = await Attendance.insertMany(mockRecords);
      operationsCount.inserted += insertResult.length;
    }
  }

  // Clear dashboard caches since global stats have changed
  clearCache();

  return {
    message: "Bulk override applied successfully",
    operationsCount,
  };
};
