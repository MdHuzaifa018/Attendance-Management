import Class from "../models/Class.js";
import Department from "../models/Department.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";

/**
 * getAllClasses
 * Returns paginated classes with department and student counts.
 * If all=true, returns active classes list for dropdown selectors.
 */
export const getAllClasses = async ({
  search = "",
  departmentId = "",
  page = 1,
  limit = 20,
  all = false,
} = {}) => {
  const filter = {};

  if (departmentId) {
    filter.department = departmentId;
  }

  // If lightweight list requested for dropdowns
  if (all) {
    filter.isActive = true;
    const classes = await Class.find(filter)
      .select("_id name code department semester section academicYear isActive")
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

  // Aggregate student and subject counts for each class
  const classes = await Promise.all(
    classDocs.map(async (cls) => {
      const [studentCount, subjectCount] = await Promise.all([
        Student.countDocuments({ class: cls._id }),
        Subject.countDocuments({ class: cls._id }),
      ]);
      return {
        ...cls,
        stats: {
          students: studentCount,
          subjects: subjectCount,
        },
      };
    })
  );

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
 * Throws 404 if not found.
 */
export const getClassById = async (classId) => {
  const cls = await Class.findById(classId).populate("department", "name code");
  if (!cls) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  const subjects = await Subject.find({ class: classId }).select(
    "_id name code totalClasses"
  );

  return {
    ...cls.toObject(),
    subjects,
  };
};

/**
 * createClass
 * Validates department existence and code uniqueness.
 */
export const createClass = async (data) => {
  const department = await Department.findById(data.departmentId);
  if (!department) {
    const err = new Error("Department does not exist");
    err.statusCode = 404;
    throw err;
  }

  const existingCode = await Class.findOne({ code: data.code });
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
 * Updates class fields and ensures code uniqueness.
 */
export const updateClass = async (classId, updates) => {
  const updateData = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.code !== undefined) updateData.code = updates.code;
  if (updates.departmentId !== undefined) {
    const dept = await Department.findById(updates.departmentId);
    if (!dept) {
      const err = new Error("Selected department does not exist");
      err.statusCode = 404;
      throw err;
    }
    updateData.department = updates.departmentId;
  }
  if (updates.semester !== undefined) updateData.semester = updates.semester;
  if (updates.section !== undefined) updateData.section = updates.section;
  if (updates.academicYear !== undefined) updateData.academicYear = updates.academicYear;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

  if (updates.code) {
    const existing = await Class.findOne({
      code: updates.code,
      _id: { $ne: classId },
    });
    if (existing) {
      const err = new Error(`Class code "${updates.code}" already exists`);
      err.statusCode = 409;
      throw err;
    }
  }

  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedClass) {
    const err = new Error("Class not found");
    err.statusCode = 404;
    throw err;
  }

  return getClassById(classId);
};

/**
 * deleteClass
 * Safeguarded against orphaned student and subject records.
 */
export const deleteClass = async (classId) => {
  const cls = await Class.findById(classId);
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
    const err = new Error(
      `Cannot delete class: ${studentCount} student(s) are enrolled in it. Reassign or remove them first.`
    );
    err.statusCode = 400;
    throw err;
  }

  if (subjectCount > 0) {
    const err = new Error(
      `Cannot delete class: ${subjectCount} subject(s) are attached to it. Remove subjects first.`
    );
    err.statusCode = 400;
    throw err;
  }

  await Class.findByIdAndDelete(classId);
  return { message: "Class deleted successfully" };
};
