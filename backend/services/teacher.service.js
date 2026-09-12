import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Populate teacher query with User and Department info consistently.
 */
const populateTeacher = (query) =>
  query
    .populate("user", "name email isActive")
    .populate("department", "name code");

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * getAllTeachers
 * Returns paginated teachers with optional search and department filter.
 *
 * @param {string} search       - Search by employeeId or teacher name
 * @param {string} departmentId - Filter by department ObjectId
 * @param {number} page         - 1-indexed page number
 * @param {number} limit        - Items per page (default 20)
 */
export const getAllTeachers = async ({
  search = "",
  departmentId = "",
  page = 1,
  limit = 20,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  // Search by employeeId OR user name
  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");

    // First find matching user IDs
    const matchingUsers = await User.find({ name: regex }).select("_id").lean();
    const userIds = matchingUsers.map((u) => u._id);

    filter.$or = [{ employeeId: regex }, { user: { $in: userIds } }];
  }

  if (departmentId) filter.department = departmentId;

  const [teachers, total] = await Promise.all([
    populateTeacher(Teacher.find(filter))
      .sort({ employeeId: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Teacher.countDocuments(filter),
  ]);

  return {
    teachers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * getTeacherById
 * Throws 404 if not found.
 */
export const getTeacherById = async (teacherId) => {
  const teacher = await populateTeacher(Teacher.findById(teacherId));
  if (!teacher) {
    const err = new Error("Teacher not found");
    err.statusCode = 404;
    throw err;
  }
  return teacher;
};

/**
 * createTeacher
 * Atomically creates a User account (role: "teacher") and a Teacher profile.
 * Rolls back User if Teacher creation fails.
 *
 * @param {object} data - Validated body from createTeacherSchema
 */
export const createTeacher = async (data) => {
  // Check uniqueness before database writes
  const [existingEmpId, existingEmail] = await Promise.all([
    Teacher.findOne({ employeeId: data.employeeId }),
    User.findOne({ email: data.email }),
  ]);

  if (existingEmpId) {
    const err = new Error(`Employee ID "${data.employeeId}" is already taken`);
    err.statusCode = 409;
    throw err;
  }
  if (existingEmail) {
    const err = new Error(`Email "${data.email}" is already registered`);
    err.statusCode = 409;
    throw err;
  }

  // 1. Create User account with role 'teacher'
  const hashedPassword = await hashPassword(data.password);
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "teacher",
    isActive: true,
  });

  let newTeacher;
  try {
    // 2. Create Teacher profile linked to User
    newTeacher = await Teacher.create({
      user: newUser._id,
      employeeId: data.employeeId,
      department: data.departmentId,
      phone: data.phone || "",
      designation: data.designation || "Assistant Professor",
      isActive: true,
    });
  } catch (err) {
    // Rollback orphaned User
    await User.findByIdAndDelete(newUser._id).catch(() => {});
    throw err;
  }

  return getTeacherById(newTeacher._id);
};

/**
 * updateTeacher
 * Updates Teacher profile fields and optionally synchronizes isActive with linked User.
 *
 * @param {string} teacherId
 * @param {object} updates - Validated body from updateTeacherSchema
 */
export const updateTeacher = async (teacherId, updates) => {
  const updateData = {};
  if (updates.employeeId !== undefined) updateData.employeeId = updates.employeeId;
  if (updates.departmentId !== undefined) updateData.department = updates.departmentId;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.designation !== undefined) updateData.designation = updates.designation;

  // Sync isActive with linked User
  if (updates.isActive !== undefined) {
    updateData.isActive = updates.isActive;
    const teacher = await Teacher.findById(teacherId);
    if (teacher) {
      await User.findByIdAndUpdate(teacher.user, { isActive: updates.isActive });
    }
  }

  // Check employeeId uniqueness if changed
  if (updates.employeeId) {
    const existing = await Teacher.findOne({
      employeeId: updates.employeeId,
      _id: { $ne: teacherId },
    });
    if (existing) {
      const err = new Error(`Employee ID "${updates.employeeId}" is already taken`);
      err.statusCode = 409;
      throw err;
    }
  }

  const teacher = await Teacher.findByIdAndUpdate(
    teacherId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!teacher) {
    const err = new Error("Teacher not found");
    err.statusCode = 404;
    throw err;
  }

  return getTeacherById(teacherId);
};

/**
 * deleteTeacher
 * Deletes the Teacher profile AND the linked User account.
 */
export const deleteTeacher = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    const err = new Error("Teacher not found");
    err.statusCode = 404;
    throw err;
  }

  const userId = teacher.user;
  await Teacher.findByIdAndDelete(teacherId);
  await User.findByIdAndDelete(userId);

  return { message: "Teacher deleted successfully" };
};
