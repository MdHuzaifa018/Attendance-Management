import Class from "../models/Class.js";
import Department from "../models/Department.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import AcademicSession from "../models/AcademicSession.js";

// ── Service Functions ─────────────────────────────────────────────────────────

/**
 * getAllClasses
 * Returns paginated classes with student and subject counts per class.
 * If `all=true`, returns a lightweight active-class list for dropdowns.
 *
 * Performance: Counts are fetched in 2 aggregations instead of 2 queries per class.
 */
export const getAllClasses = async ({
  search = "",
  departmentId = "",
  page = 1,
  limit = 20,
  all = false,
  activeSessionOnly = false,
} = {}) => {
  const filter = {};
  if (departmentId) filter.department = departmentId;

  if (activeSessionOnly) {
    const activeSess = await AcademicSession.findOne({ isCurrent: true }).lean();
    if (activeSess) {
      filter.academicSession = activeSess._id;
    }
  }

  // Lightweight list for form dropdowns (no pagination, no counts)
  if (all) {
    filter.isActive = true;
    const classes = await Class.find(filter)
      .select("_id name code department semester section academicYear academicSession isActive")
      .populate("department", "name code")
      .sort({ name: 1 })
      .lean();
    return { classes };
  }

  const skip = (page - 1) * limit;

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const [classDocs, total] = await Promise.all([
    Class.find(filter)
      .populate("department", "name code")
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Class.countDocuments(filter),
  ]);

  if (classDocs.length === 0) {
    return {
      classes: [],
      pagination: { total: 0, page: Number(page), limit: Number(limit), totalPages: 0 },
    };
  }

  // Single round-trip per collection instead of 2 queries per class (N+1 fix)
  const classIds = classDocs.map((c) => c._id);

  const [studentCounts, subjectCounts] = await Promise.all([
    Student.aggregate([
      { $match: { class: { $in: classIds } } },
      { $group: { _id: "$class", count: { $sum: 1 } } },
    ]),
    Subject.aggregate([
      { $match: { class: { $in: classIds } } },
      { $group: { _id: "$class", count: { $sum: 1 } } },
    ]),
  ]);

  const studentMap = new Map(studentCounts.map((x) => [String(x._id), x.count]));
  const subjectMap = new Map(subjectCounts.map((x) => [String(x._id), x.count]));

  const classes = classDocs.map((cls) => {
    const id = String(cls._id);
    return {
      ...cls,
      stats: {
        students: studentMap.get(id) || 0,
        subjects: subjectMap.get(id) || 0,
      },
    };
  });

  return {
    classes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * getClassById
 * Returns one class with its department info and subject list.
 */
export const getClassById = async (classId) => {
  const [cls, subjects] = await Promise.all([
    Class.findById(classId).populate("department", "name code").lean(),
    Subject.find({ class: classId }).select("_id name code totalClasses").lean(),
  ]);

  if (!cls) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  return { ...cls, subjects };
};

/**
 * createClass
 * Validates department exists and class code is unique.
 */
export const createClass = async (data) => {
  const [department, existingCode] = await Promise.all([
    Department.findById(data.departmentId).lean(),
    Class.findOne({ code: data.code }).lean(),
  ]);

  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }
  if (existingCode) {
    const err = new Error(`Class code "${data.code}" already exists`);
    err.statusCode = 409;
    throw err;
  }

  const newClass = await Class.create({
    name: data.name,
    code: data.code,
    department: data.departmentId,
    semester: data.semester,
    section: data.section || "A",
    academicYear: data.academicYear,
    isActive: true,
  });

  return getClassById(newClass._id);
};

/**
 * updateClass
 * Updates allowed fields, validates any changed foreign keys.
 */
export const updateClass = async (classId, updates) => {
  const updateData = {};

  if (updates.name !== undefined)         updateData.name = updates.name;
  if (updates.semester !== undefined)     updateData.semester = updates.semester;
  if (updates.section !== undefined)      updateData.section = updates.section;
  if (updates.academicYear !== undefined) updateData.academicYear = updates.academicYear;
  if (updates.isActive !== undefined)     updateData.isActive = updates.isActive;

  // Validate new department if provided
  if (updates.departmentId !== undefined) {
    const dept = await Department.findById(updates.departmentId).lean();
    if (!dept) {
      const err = new Error("Department not found");
      err.statusCode = 404;
      throw err;
    }
    updateData.department = updates.departmentId;
  }

  // Validate code uniqueness if changing
  if (updates.code !== undefined) {
    const existing = await Class.findOne({ code: updates.code, _id: { $ne: classId } }).lean();
    if (existing) {
      const err = new Error(`Class code "${updates.code}" already exists`);
      err.statusCode = 409;
      throw err;
    }
    updateData.code = updates.code;
  }

  const updated = await Class.findByIdAndUpdate(
    classId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updated) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  return getClassById(classId);
};

/**
 * deleteClass
 * Refuses deletion if students or subjects are still linked.
 */
export const deleteClass = async (classId) => {
  const cls = await Class.findById(classId).lean();
  if (!cls) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  const [studentCount, subjectCount] = await Promise.all([
    Student.countDocuments({ class: classId }),
    Subject.countDocuments({ class: classId }),
  ]);

  if (studentCount > 0) {
    const err = new Error(`Cannot delete: ${studentCount} student(s) are enrolled in this class`);
    err.statusCode = 400;
    throw err;
  }
  if (subjectCount > 0) {
    const err = new Error(`Cannot delete: ${subjectCount} subject(s) are attached to this class`);
    err.statusCode = 400;
    throw err;
  }

  await Class.findByIdAndDelete(classId);
  return { message: "Class deleted successfully" };
};
