import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT token verify karna aur user ko req.user me set karna
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token header me hona chahiye: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account is deactivated" });
    }

    req.user = user; // Aage ke routes me available hoga
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired, please login again" });
    }
    next(error);
  }
};
