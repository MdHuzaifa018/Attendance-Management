import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the Bearer token and attaches the user to req.user.
// Called before any protected route handler.
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      const err = new Error("Authentication token is required");
      err.statusCode = 401;
      return next(err);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    if (!user.isActive) {
      const err = new Error("Your account has been deactivated");
      err.statusCode = 403;
      return next(err);
    }

    req.user = user; // { _id, name, email, role, isActive }
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      err.statusCode = 401;
      err.message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      err.statusCode = 401;
      err.message = "Token has expired — please log in again";
    }
    next(err);
  }
};
