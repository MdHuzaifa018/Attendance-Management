import Student from "../models/Student.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Populate a student query with user, department, and class data.
 * Used consistently so every service function returns the same shape.
 */
const populateStudent = (query) =>
  query
    .populate("user", "name email isActive")
    .populate("department", "name code")
    .populate("class", "name code");

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * getAllStudents
 * Returns paginated students with optional search and filter.
 *
 * @param {string}  search       - Search by name (user) or roll number (case-insensitive)
 * @param {string}  classId      - Filter by class ObjectId
 * @param {string}  departmentId - Filter by department ObjectId
 * @param {number}  page         - 1-indexed page number
 * @param {number}  limit        - Items per page (default 20)
 */
export const getAllStudents = async ({
  search = "",
  classId = "",
  departmentId = "",
  page = 1,
  limit = 20,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  // Search: by roll number OR by user name
  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");

    // First find User IDs whose name matches
    const matchingUsers = await User.find({ name: regex }).select("_id").lean();
    const userIds = matchingUsers.map((u) => u._id);

    filter.$or = [{ rollNo: regex }, { user: { $in: userIds } }];
  }

  if (classId) filter.class = classId;
  if (departmentId) filter.department = departmentId;

  const [students, total] = await Promise.all([
    populateStudent(Student.find(filter))
      .sort({ rollNo: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * getStudentById
 * Throws 404 if not found.
 */
export const getStudentById = async (studentId) => {
  const student = await populateStudent(Student.findById(studentId));
  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }
  return student;
};

/**
 * createStudent
 * Creates a User account (role=student) and a Student profile atomically.
 * Rolls back the User if Student creation fails.
 *
 * @param {object} data - Validated body from createStudentSchema
 */
export const createStudent = async (data) => {
  // Check uniqueness before any DB writes
  const [existingRoll, existingEmail] = await Promise.all([
    Student.findOne({ rollNo: data.rollNo }),
    User.findOne({ email: data.email }),
  ]);

  if (existingRoll) {
    const err = new Error(`Roll number "${data.rollNo}" is already taken`);
    err.statusCode = 409;
    throw err;
  }
  if (existingEmail) {
    const err = new Error(`Email "${data.email}" is already registered`);
    err.statusCode = 409;
    throw err;
  }

  // Create User
  const hashedPassword = await hashPassword(data.password);
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "student",
    isActive: true,
  });

  let newStudent;
  try {
    // Create Student profile linked to the User
    newStudent = await Student.create({
      user: newUser._id,
      rollNo: data.rollNo,
      fatherName: data.fatherName,
      department: data.departmentId,
      class: data.classId,
      admissionYear: data.admissionYear,
      phone: data.phone || "",
    });
  } catch (err) {
    // Rollback: remove the orphaned User if Student creation failed
    await User.findByIdAndDelete(newUser._id).catch(() => {});
    throw err;
  }

  return getStudentById(newStudent._id);
};

/**
 * updateStudent
 * Updates Student profile fields. Does NOT update the linked User account.
 * To change a student's name or email, use a separate user-management endpoint.
 *
 * @param {string} studentId
 * @param {object} updates - Validated body from updateStudentSchema
 */
export const updateStudent = async (studentId, updates) => {
  // Build the update object — map departmentId/classId → department/class
  const updateData = {};
  if (updates.rollNo !== undefined) updateData.rollNo = updates.rollNo;
  if (updates.fatherName !== undefined) updateData.fatherName = updates.fatherName;
  if (updates.departmentId !== undefined) updateData.department = updates.departmentId;
  if (updates.classId !== undefined) updateData.class = updates.classId;
  if (updates.admissionYear !== undefined) updateData.admissionYear = updates.admissionYear;
  if (updates.phone !== undefined) updateData.phone = updates.phone;

  // isActive synced to the linked User as well
  if (updates.isActive !== undefined) {
    updateData.isActive = updates.isActive;
    const student = await Student.findById(studentId);
    if (student) {
      await User.findByIdAndUpdate(student.user, { isActive: updates.isActive });
    }
  }

  // Check rollNo uniqueness if it's being changed
  if (updates.rollNo) {
    const existing = await Student.findOne({
      rollNo: updates.rollNo,
      _id: { $ne: studentId },
    });
    if (existing) {
      const err = new Error(`Roll number "${updates.rollNo}" is already taken`);
      err.statusCode = 409;
      throw err;
    }
  }

  const student = await Student.findByIdAndUpdate(
    studentId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  return getStudentById(studentId);
};

/**
 * deleteStudent
 * Deletes the Student profile AND the linked User account.
 * This is a hard delete — use isActive=false for soft deactivation instead.
 */
export const deleteStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }

  const userId = student.user;
  await Student.findByIdAndDelete(studentId);
  await User.findByIdAndDelete(userId);

  return { message: "Student deleted successfully" };
};
