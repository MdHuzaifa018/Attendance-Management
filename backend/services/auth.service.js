import User from "../models/User.js";
import Student from "../models/Student.js";
import StudentRegistrationRequest from "../models/StudentRegistrationRequest.js";

import { hashPassword, comparePassword } from "../utils/password.js";

import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

export const registerUser = async ({
  name,
  email,
  password,
  rollNo,
  departmentId,
  classId,
  fatherName,
  motherName,
  phone,
  admissionYear,
}) => {
  // Validate that required academic fields are provided
  if (!rollNo || !departmentId || !classId || !fatherName) {
    const error = new Error("Roll Number, Department, Class, and Father's Name are required for student registration");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedRoll = rollNo.toUpperCase().trim();

  // 1. Check if email already registered as an active User
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("An active user account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // 2. Check if roll number already taken by an enrolled student
  const existingStudent = await Student.findOne({ rollNo: normalizedRoll });
  if (existingStudent) {
    const error = new Error(`A student with roll number "${normalizedRoll}" is already registered`);
    error.statusCode = 409;
    throw error;
  }

  // 3. Check if there is already a pending request for this email or roll number
  const existingRequest = await StudentRegistrationRequest.findOne({
    $or: [{ email: normalizedEmail }, { rollNo: normalizedRoll }],
    status: "pending",
  });
  if (existingRequest) {
    const error = new Error("A registration application with this email or roll number is already pending review");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  // 4. Save registration request for Admin Approval Queue
  const newRequest = await StudentRegistrationRequest.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    rollNo: normalizedRoll,
    fatherName: fatherName.trim(),
    motherName: (motherName || "").trim(),
    phone: (phone || "").trim(),
    department: departmentId,
    class: classId,
    admissionYear: Number(admissionYear) || new Date().getFullYear(),
    status: "pending",
  });

  return {
    requiresApproval: true,
    message: "Your registration application has been submitted successfully! Your account will be activated once verified by college administration.",
    request: {
      id: newRequest._id,
      name: newRequest.name,
      email: newRequest.email,
      rollNo: newRequest.rollNo,
      status: newRequest.status,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    // Check if user has an unapproved application in the registration queue
    const pendingRequest = await StudentRegistrationRequest.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (pendingRequest) {
      if (pendingRequest.status === "pending") {
        const error = new Error("Your student registration application is currently pending review by the College Administration. You will be able to sign in once approved.");
        error.statusCode = 403;
        throw error;
      } else if (pendingRequest.status === "rejected") {
        const reasonMsg = pendingRequest.rejectionReason ? ` Reason: "${pendingRequest.rejectionReason}".` : "";
        const error = new Error(`Your student registration application was not approved.${reasonMsg} Please contact the college office.`);
        error.statusCode = 403;
        throw error;
      }
    }

    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;

    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  return sanitizeUser(user);
};
