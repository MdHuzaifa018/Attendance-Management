import Department from "../models/Department.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

/**
 * getAllDepartments
 * Returns paginated departments with search and aggregated statistics.
 * If all=true, returns unpaginated list of active departments (for select dropdowns).
 */
export const getAllDepartments = async ({
  search = "",
  page = 1,
  limit = 20,
  all = false,
} = {}) => {
  // If `all=true`, return lightweight list for dropdowns
  if (all) {
    const departments = await Department.find({ isActive: true })
      .select("_id name code description isActive")
      .sort({ name: 1 });
    return { departments };
  }

  const skip = (page - 1) * limit;
  const filter = {};

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { code: regex }];
  }

  const [deptDocs, total] = await Promise.all([
    Department.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Department.countDocuments(filter),
  ]);

  // Aggregate class, student, and teacher counts for each department
  const departments = await Promise.all(
    deptDocs.map(async (dept) => {
      const [classCount, studentCount, teacherCount] = await Promise.all([
        Class.countDocuments({ department: dept._id }),
        Student.countDocuments({ department: dept._id }),
        Teacher.countDocuments({ department: dept._id }),
      ]);
      return {
        ...dept,
        stats: {
          classes: classCount,
          students: studentCount,
          teachers: teacherCount,
        },
      };
    })
  );

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
 * Throws 404 if not found.
 */
export const getDepartmentById = async (departmentId) => {
  const department = await Department.findById(departmentId);
  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }

  const classes = await Class.find({ department: departmentId }).select(
    "_id name code semester academicYear"
  );

  return {
    ...department.toObject(),
    classes,
  };
};

/**
 * createDepartment
 * Ensures code and name uniqueness.
 */
export const createDepartment = async (data) => {
  const [existingCode, existingName] = await Promise.all([
    Department.findOne({ code: data.code }),
    Department.findOne({ name: data.name }),
  ]);

  if (existingCode) {
    const err = new Error(`Department code "${data.code}" already exists`);
    err.statusCode = 409;
    throw err;
  }
  if (existingName) {
    const err = new Error(`Department name "${data.name}" already exists`);
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
 * Updates department details while validating code and name uniqueness.
 */
export const updateDepartment = async (departmentId, updates) => {
  if (updates.code) {
    const existing = await Department.findOne({
      code: updates.code,
      _id: { $ne: departmentId },
    });
    if (existing) {
      const err = new Error(`Department code "${updates.code}" already exists`);
      err.statusCode = 409;
      throw err;
    }
  }

  if (updates.name) {
    const existing = await Department.findOne({
      name: updates.name,
      _id: { $ne: departmentId },
    });
    if (existing) {
      const err = new Error(`Department name "${updates.name}" already exists`);
      err.statusCode = 409;
      throw err;
    }
  }

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
 * Safeguarded against orphaned academic entities.
 */
export const deleteDepartment = async (departmentId) => {
  const department = await Department.findById(departmentId);
  if (!department) {
    const err = new Error("Department not found");
    err.statusCode = 404;
    throw err;
  }

  const [classCount, studentCount, teacherCount] = await Promise.all([
    Class.countDocuments({ department: departmentId }),
    Student.countDocuments({ department: departmentId }),
    Teacher.countDocuments({ department: departmentId }),
  ]);

  if (classCount > 0) {
    const err = new Error(
      `Cannot delete department: ${classCount} class(es) are associated with it. Remove or reassign them first.`
    );
    err.statusCode = 400;
    throw err;
  }

  if (studentCount > 0) {
    const err = new Error(
      `Cannot delete department: ${studentCount} student(s) are enrolled in it.`
    );
    err.statusCode = 400;
    throw err;
  }

  if (teacherCount > 0) {
    const err = new Error(
      `Cannot delete department: ${teacherCount} teacher(s) are assigned to it.`
    );
    err.statusCode = 400;
    throw err;
  }

  await Department.findByIdAndDelete(departmentId);
  return { message: "Department deleted successfully" };
};
