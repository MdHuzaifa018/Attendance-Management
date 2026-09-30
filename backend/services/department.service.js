import Department from "../models/Department.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

// ── Service Functions ─────────────────────────────────────────────────────────

/**
 * getAllDepartments
 * Returns paginated departments with student/class/teacher counts.
 * If `all=true`, returns a lightweight list for dropdown selectors (no counts).
 *
 * Performance: Stats are fetched with a single $facet aggregation instead of
 * N separate countDocuments calls (was an N+1 query problem before).
 */
export const getAllDepartments = async ({
  search = "",
  page = 1,
  limit = 20,
  all = false,
} = {}) => {
  // Lightweight list for dropdowns — no counts needed
  if (all) {
    const departments = await Department.find({ isActive: true })
      .select("_id name code description isActive")
      .sort({ name: 1 })
      .lean();
    return { departments };
  }

  const skip = (page - 1) * limit;
  const filter = {};

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const [deptDocs, total] = await Promise.all([
    Department.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)).lean(),
    Department.countDocuments(filter),
  ]);

  if (deptDocs.length === 0) {
    return {
      departments: [],
      pagination: { total: 0, page: Number(page), limit: Number(limit), totalPages: 0 },
    };
  }

  // Single aggregation to count classes, students, and teachers for all departments at once.
  // This replaces the old approach that made 3 DB calls per department (N+1 problem).
  const deptIds = deptDocs.map((d) => d._id);

  const [classCounts, studentCounts, teacherCounts] = await Promise.all([
    Class.aggregate([
      { $match: { department: { $in: deptIds } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]),
    Student.aggregate([
      { $match: { department: { $in: deptIds } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]),
    Teacher.aggregate([
      { $match: { departments: { $in: deptIds } } },
      { $group: { _id: "$departments", count: { $sum: 1 } } },
    ]),
  ]);

  // Build lookup maps for O(1) access
  const toMap = (arr) => new Map(arr.map((x) => [String(x._id), x.count]));
  const classMap   = toMap(classCounts);
  const studentMap = toMap(studentCounts);
  const teacherMap = toMap(teacherCounts);

  const departments = deptDocs.map((dept) => {
    const id = String(dept._id);
    return {
      ...dept,
      stats: {
        classes:  classMap.get(id) || 0,
        students: studentMap.get(id) || 0,
        teachers: teacherMap.get(id) || 0,
      },
    };
  });

  return {
    departments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * getDepartmentById
 * Returns one department with its list of classes.
 */
export const getDepartmentById = async (departmentId) => {
  const [department, classes] = await Promise.all([
    Department.findById(departmentId).lean(),
    Class.find({ department: departmentId })
      .select("_id name code semester academicYear")
      .sort({ name: 1 })
      .lean(),
  ]);

  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }

  return { ...department, classes };
};

/**
 * createDepartment
 * Checks code and name uniqueness before creating.
 */
export const createDepartment = async (data) => {
  const [existingCode, existingName] = await Promise.all([
    Department.findOne({ code: data.code }).lean(),
    Department.findOne({ name: data.name }).lean(),
  ]);

  if (existingCode) {
    const err = new Error(`Department code "${data.code}" is already in use`);
    err.statusCode = 409;
    throw err;
  }
  if (existingName) {
    const err = new Error(`Department name "${data.name}" is already in use`);
    err.statusCode = 409;
    throw err;
  }

  const department = await Department.create({
    name: data.name,
    code: data.code,
    description: data.description || "",
    isActive: true,
  });

  return department;
};

/**
 * updateDepartment
 * Updates allowed fields, preventing code/name collisions with other departments.
 */
export const updateDepartment = async (departmentId, updates) => {
  // Check uniqueness only for fields that are being changed
  const checks = [];
  if (updates.code) {
    checks.push(
      Department.findOne({ code: updates.code, _id: { $ne: departmentId } }).lean().then((found) => {
        if (found) {
          const err = new Error(`Department code "${updates.code}" is already in use`);
          err.statusCode = 409;
          throw err;
        }
      })
    );
  }
  if (updates.name) {
    checks.push(
      Department.findOne({ name: updates.name, _id: { $ne: departmentId } }).lean().then((found) => {
        if (found) {
          const err = new Error(`Department name "${updates.name}" is already in use`);
          err.statusCode = 409;
          throw err;
        }
      })
    );
  }
  await Promise.all(checks);

  const department = await Department.findByIdAndUpdate(
    departmentId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }

  return department;
};

/**
 * deleteDepartment
 * Prevents deletion if any classes, students, or teachers are still linked.
 */
export const deleteDepartment = async (departmentId) => {
  const department = await Department.findById(departmentId).lean();
  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }

  const [classCount, studentCount, teacherCount] = await Promise.all([
    Class.countDocuments({ department: departmentId }),
    Student.countDocuments({ department: departmentId }),
    Teacher.countDocuments({ departments: departmentId }),
  ]);

  if (classCount > 0) {
    const err = new Error(`Cannot delete: ${classCount} class(es) are linked to this department`);
    err.statusCode = 400;
    throw err;
  }
  if (studentCount > 0) {
    const err = new Error(`Cannot delete: ${studentCount} student(s) are enrolled in this department`);
    err.statusCode = 400;
    throw err;
  }
  if (teacherCount > 0) {
    const err = new Error(`Cannot delete: ${teacherCount} teacher(s) are assigned to this department`);
    err.statusCode = 400;
    throw err;
  }

  await Department.findByIdAndDelete(departmentId);
  return { message: "Department deleted successfully" };
};
