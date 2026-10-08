import StudentRegistrationRequest from "../models/StudentRegistrationRequest.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import AcademicSession from "../models/AcademicSession.js";

/**
 * Get all student registration requests with optional status filter, search, and pagination.
 */
export const getAllRequests = async ({
  status = "",
  search = "",
  page = 1,
  limit = 20,
} = {}) => {
  const filter = {};
  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { email: regex }, { rollNo: regex }];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [requests, total] = await Promise.all([
    StudentRegistrationRequest.find(filter)
      .populate("department", "name code")
      .populate("class", "name code semester section")
      .populate("reviewedBy", "name email")
      .populate("createdStudent", "rollNo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    StudentRegistrationRequest.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get pending requests count for badge display in admin UI.
 */
export const getPendingCount = async () => {
  return await StudentRegistrationRequest.countDocuments({ status: "pending" });
};

/**
 * Approve a pending student registration request:
 * Creates User + Student + Enrollment in one smooth flow.
 */
export const approveRequest = async (requestId, adminUserId) => {
  const request = await StudentRegistrationRequest.findById(requestId);
  if (!request) {
    const error = new Error("Registration request not found");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "pending") {
    const error = new Error(`Request has already been ${request.status}`);
    error.statusCode = 400;
    throw error;
  }

  // Pre-check for conflicting records
  const [existingUser, existingStudent] = await Promise.all([
    User.findOne({ email: request.email }),
    Student.findOne({ rollNo: request.rollNo }),
  ]);

  if (existingUser) {
    const error = new Error(`A user with email "${request.email}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  if (existingStudent) {
    const error = new Error(`A student with roll number "${request.rollNo}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const activeSession = await AcademicSession.findOne({ isCurrent: true });

  // 1. Create User account (password is already hashed)
  const newUser = await User.create({
    name: request.name,
    email: request.email,
    password: request.password,
    role: "student",
    isActive: true,
  });

  let newStudent;
  try {
    // 2. Create Student profile
    newStudent = await Student.create({
      user: newUser._id,
      rollNo: request.rollNo,
      fatherName: request.fatherName,
      motherName: request.motherName || "",
      department: request.department,
      admissionYear: request.admissionYear || new Date().getFullYear(),
      duration: "2024-27",
      batch: "2024-27",
      phone: request.phone || "",
      status: "active",
      isActive: true,
    });

    // 3. Create Enrollment for current academic session
    if (activeSession) {
      await Enrollment.create({
        student: newStudent._id,
        academicSession: activeSession._id,
        department: request.department,
        class: request.class,
        rollNo: request.rollNo,
        status: "active",
      });
    }

    // 4. Mark request as approved
    request.status = "approved";
    request.reviewedBy = adminUserId;
    request.reviewedAt = new Date();
    request.createdStudent = newStudent._id;
    await request.save();

    return {
      success: true,
      message: `Student ${request.name} approved and enrolled successfully!`,
      student: newStudent,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    };
  } catch (error) {
    // Rollback user if student/enrollment creation fails
    if (newUser?._id) {
      await User.findByIdAndDelete(newUser._id);
    }
    throw error;
  }
};

/**
 * Reject a pending student registration request with a reason.
 */
export const rejectRequest = async (requestId, reason, adminUserId) => {
  const request = await StudentRegistrationRequest.findById(requestId);
  if (!request) {
    const error = new Error("Registration request not found");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "pending") {
    const error = new Error(`Request has already been ${request.status}`);
    error.statusCode = 400;
    throw error;
  }

  request.status = "rejected";
  request.rejectionReason = (reason || "Application rejected by college administrator").trim();
  request.reviewedBy = adminUserId;
  request.reviewedAt = new Date();
  await request.save();

  return {
    success: true,
    message: `Application for ${request.name} rejected`,
    request,
  };
};
