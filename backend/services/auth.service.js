import User from "../models/User.js";

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

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User with this email already exists");

    error.statusCode = 409;

    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "student",
  });

  const token = generateToken(user._id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
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
