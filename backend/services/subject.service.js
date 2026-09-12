import Subject from "../models/Subject.js";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Attendance from "../models/Attendance.js";

/**
 * getAllSubjects
 * Returns paginated subjects with populated class and teacher information.
 * If all=true, returns active subjects list for dropdowns.
 */
export const getAllSubjects = async ({
  search = "",
  classId = "",
  teacherId = "",
  page = 1,
  limit = 20,
  all = false,
} = {}) => {
  const filter = {};

  if (classId) {
    filter.class = classId;
  }

  if (teacherId) {
    filter.teacher = teacherId;
  }

  // If lightweight list for dropdowns
  if (all) {
    filter.isActive = true;
    const subjects = await Subject.find(filter)
      .select("_id name code class teacher totalClasses isActive")
      .populate("class", "name code semester")
      .populate({
        path: "teacher",
        select: "employeeId designation user",
        populate: { path: "user", select: "name email" },
      })
      .sort({ code: 1 })
      .lean();

    return { subjects };
  }

  const skip = (page - 1) * limit;

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const [subjects, total] = await Promise.all([
    Subject.find(filter)
      .populate({
        path: "class",
        select: "name code semester academicYear department",
        populate: { path: "department", select: "name code" },
      })
      .populate({
        path: "teacher",
        select: "employeeId designation user",
        populate: { path: "user", select: "name email" },
      })
      .sort({ code: 1, name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Subject.countDocuments(filter),
  ]);

  return {
    subjects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * getSubjectById
 * Returns a single subject by ID with populated references.
 */
export const getSubjectById = async (subjectId) => {
  const subject = await Subject.findById(subjectId)
    .populate({
      path: "class",
      select: "name code semester academicYear department",
      populate: { path: "department", select: "name code" },
    })
    .populate({
      path: "teacher",
      select: "employeeId designation user",
      populate: { path: "user", select: "name email" },
    });

  if (!subject) {
    const err = new Error("Subject not found");
    err.statusCode = 404;
    throw err;
  }

  return subject.toObject();
};

/**
 * createSubject
 * Validates Class and Teacher existence, ensures code uniqueness within class.
 */
export const createSubject = async (data) => {
  const [cls, teacher] = await Promise.all([
    Class.findById(data.classId),
    Teacher.findById(data.teacherId),
  ]);

  if (!cls) {
    const err = new Error("Selected class does not exist");
    err.statusCode = 404;
    throw err;
  }

  if (!teacher) {
    const err = new Error("Selected teacher does not exist");
    err.statusCode = 404;
    throw err;
  }

  // Ensure subject code is unique within this class
  const existingCode = await Subject.findOne({
    code: data.code,
    class: data.classId,
  });

  if (existingCode) {
    const err = new Error(
      `Subject code "${data.code}" already exists in class "${cls.code}"`
    );
    err.statusCode = 409;
    throw err;
  }

  const newSubject = await Subject.create({
    name: data.name,
    code: data.code,
    class: data.classId,
    teacher: data.teacherId,
    totalClasses: data.totalClasses || 0,
    isActive: true,
  });

  return getSubjectById(newSubject._id);
};

/**
 * updateSubject
 * Updates subject details and prevents duplicate code collisions within class.
 */
export const updateSubject = async (subjectId, updates) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    const err = new Error("Subject not found");
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.code !== undefined) updateData.code = updates.code;
  if (updates.totalClasses !== undefined)
    updateData.totalClasses = updates.totalClasses;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

  if (updates.classId !== undefined) {
    const cls = await Class.findById(updates.classId);
    if (!cls) {
      const err = new Error("Selected class does not exist");
      err.statusCode = 404;
      throw err;
    }
    updateData.class = updates.classId;
  }

  if (updates.teacherId !== undefined) {
    const teacher = await Teacher.findById(updates.teacherId);
    if (!teacher) {
      const err = new Error("Selected teacher does not exist");
      err.statusCode = 404;
      throw err;
    }
    updateData.teacher = updates.teacherId;
  }

  // Check code uniqueness within target class if code or class is being changed
  const targetCode = updates.code || subject.code;
  const targetClass = updates.classId || subject.class;

  const existingCode = await Subject.findOne({
    code: targetCode,
    class: targetClass,
    _id: { $ne: subjectId },
  });

  if (existingCode) {
    const err = new Error(
      `Subject code "${targetCode}" is already in use in this class`
    );
    err.statusCode = 409;
    throw err;
  }

  await Subject.findByIdAndUpdate(
    subjectId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return getSubjectById(subjectId);
};

/**
 * deleteSubject
 * Safeguarded against deletion if attendance sessions have been recorded.
 */
export const deleteSubject = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    const err = new Error("Subject not found");
    err.statusCode = 404;
    throw err;
  }

  const attendanceCount = await Attendance.countDocuments({
    subject: subjectId,
  });

  if (attendanceCount > 0) {
    const err = new Error(
      `Cannot delete subject: ${attendanceCount} attendance record(s) are linked to it.`
    );
    err.statusCode = 400;
    throw err;
  }

  await Subject.findByIdAndDelete(subjectId);
  return { message: "Subject deleted successfully" };
};
