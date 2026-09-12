import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authentication token is required");

      error.statusCode = 401;

      throw error;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Authentication token is missing");

      error.statusCode = 401;

      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 401;

      throw error;
    }

    if (!user.isActive) {
      const error = new Error("User account is inactive");

      error.statusCode = 403;

      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "Invalid authentication token";
    }

    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "Authentication token has expired";
    }

    next(error);
  }
};
