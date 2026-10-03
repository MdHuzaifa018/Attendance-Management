import Student from "../models/Student.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import mongoose from "mongoose";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Populate a student query with user, department, and class data.
 * Used consistently so every service function returns the same shape.
 */
const populateStudent = (query) =>
  query
    .populate("user", "name email isActive")
    .populate("department", "name code");

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
  const filter = { status: { $in: ["active", "year_repeat"] } };

  if (classId) filter.class = classId;
  if (departmentId) filter.department = departmentId;

  // Search: by roll number OR by user name
  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");

    // Find User IDs whose name matches
    const matchingUsers = await User.find({ name: regex }).select("_id").lean();
    const userIds = matchingUsers.map((u) => u._id);
    
    // Find Student IDs for those Users
    const matchingStudents = await Student.find({ user: { $in: userIds } }).select("_id").lean();
    const studentIds = matchingStudents.map(s => s._id);

    filter.$or = [{ rollNo: regex }, { student: { $in: studentIds } }];
  }

  const [enrollments, total] = await Promise.all([
    mongoose.model("Enrollment").find(filter)
      .populate({
        path: "student",
        populate: [
          { path: "user", select: "name email isActive" },
          { path: "department", select: "name code" }
        ]
      })
      .populate("class", "name code")
      .sort({ rollNo: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    mongoose.model("Enrollment").countDocuments(filter),
  ]);

  // Map to the shape frontend expects
  const students = enrollments.map(enr => {
    const student = enr.student;
    if (student) {
      student.class = enr.class;
      student.rollNo = enr.rollNo;
      student.enrollmentId = enr._id;
    }
    return student;
  }).filter(Boolean);

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
  const student = await populateStudent(Student.findById(studentId)).lean();
  if (!student) {
    const err = new Error("Student not found");
    err.statusCode = 404;
    throw err;
  }
  
  const enrollment = await mongoose.model("Enrollment").findOne({ 
    student: studentId,
    status: { $in: ["active", "year_repeat"] }
  }).populate("class", "name code").lean();

  if (enrollment) {
    student.class = enrollment.class;
    student.enrollmentId = enrollment._id;
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
      motherName: data.motherName || "",
      department: data.departmentId,
      admissionYear: data.admissionYear,
      duration: data.duration || "2024-27",
      phone: data.phone || "",
      aadharNo: data.aadharNo || "",
      idCardNo: data.idCardNo || "",
      photo: data.photo || "",
      bloodGroup: data.bloodGroup || "",
      dob: data.dob || "",
      address: data.address || "",
      signature: data.signature || "",
      directorSignature: data.directorSignature || "",
      status: "active",
      batch: data.duration || "2024-27"
    });

    // Create Enrollment for the student
    const activeSession = await mongoose.model("AcademicSession").findOne({ isCurrent: true });
    if (activeSession) {
      const classDoc = await mongoose.model("Class").findById(data.classId);
      await mongoose.model("Enrollment").create({
        student: newStudent._id,
        academicSession: activeSession._id,
        class: data.classId,
        department: data.departmentId,
        program: classDoc?.program,
        rollNo: data.rollNo,
        year: classDoc?.semester ? Math.ceil(classDoc.semester / 2) : 1,
        semester: classDoc?.semester || 1,
        section: classDoc?.section || "A",
        status: "active"
      });
    }
  } catch (err) {
    // Rollback: remove the orphaned User if Student creation failed
    await User.findByIdAndDelete(newUser._id).catch(() => {});
    throw err;
  }

  return getStudentById(newStudent._id);
};

/**
 * updateStudent
 * Updates Student profile fields and optionally the linked User's name.
 *
 * @param {string} studentId
 * @param {object} updates - Validated body from updateStudentSchema
 */
export const updateStudent = async (studentId, updates) => {
  // Build the update object — map departmentId/classId → department/class
  const updateData = {};
  if (updates.rollNo !== undefined) updateData.rollNo = updates.rollNo;
  if (updates.fatherName !== undefined) updateData.fatherName = updates.fatherName;
  if (updates.motherName !== undefined) updateData.motherName = updates.motherName;
  if (updates.departmentId !== undefined) updateData.department = updates.departmentId;
  if (updates.admissionYear !== undefined) updateData.admissionYear = updates.admissionYear;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.aadharNo !== undefined) updateData.aadharNo = updates.aadharNo;
  if (updates.idCardNo !== undefined) updateData.idCardNo = updates.idCardNo;
  if (updates.photo !== undefined) updateData.photo = updates.photo;
  if (updates.bloodGroup !== undefined) updateData.bloodGroup = updates.bloodGroup;
  if (updates.dob !== undefined) updateData.dob = updates.dob;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.signature !== undefined) updateData.signature = updates.signature;
  if (updates.directorSignature !== undefined) updateData.directorSignature = updates.directorSignature;

  // Update class in Enrollment if provided
  if (updates.classId !== undefined) {
    const activeSession = await mongoose.model("AcademicSession").findOne({ isCurrent: true });
    if (activeSession) {
      await mongoose.model("Enrollment").findOneAndUpdate(
        { student: studentId, academicSession: activeSession._id, status: { $in: ["active", "year_repeat"] } },
        { class: updates.classId }
      );
    }
  }

  // Name update synced to the linked User
  if (updates.name && updates.name.trim()) {
    const student = await Student.findById(studentId);
    if (student && student.user) {
      await User.findByIdAndUpdate(student.user, { name: updates.name.trim() });
    }
  }

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

/**
 * getGraduatedStudents (Alumni)
 */
export const getGraduatedStudents = async ({
  batch = "",
  programId = "",
  departmentId = "",
  search = "",
  page = 1,
  limit = 20,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = { status: "graduated" };

  if (batch) filter.batch = batch;
  if (departmentId) filter.department = departmentId;

  if (search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    const matchingUsers = await User.find({ name: regex }).select("_id").lean();
    const userIds = matchingUsers.map((u) => u._id);
    filter.$or = [{ rollNo: regex }, { user: { $in: userIds } }];
  }

  // If programId is provided, we need to filter students whose last enrollment was in this program
  // For simplicity, if we don't store program directly on Student, we can fetch all and filter,
  // or use an aggregation pipeline. Let's do a basic find for now.

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate("user", "name email isActive")
      .populate("department", "name code")
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
 * getAcademicHistory
 */
export const getAcademicHistory = async (studentId) => {
  const student = await getStudentById(studentId);
  
  // Get all enrollments
  const enrollments = await mongoose.model("Enrollment").find({ student: studentId })
    .populate("academicSession")
    .populate("program")
    .populate("class")
    .populate("department")
    .sort({ year: 1, semester: 1 })
    .lean();

  // Get promotion history
  const promotionHistory = await mongoose.model("PromotionHistory").find({ student: studentId })
    .populate("fromEnrollment toEnrollment fromAcademicSession toAcademicSession performedBy")
    .sort({ createdAt: -1 })
    .lean();

  return {
    student,
    enrollments,
    promotionHistory,
  };
};
