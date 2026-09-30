// Role-based access control — protect ke baad use karo
// Example: router.delete("/:id", protect, authorize("admin"), deleteHandler)
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Login required" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Allowed roles: ${roles.join(", ")}`,
    });
  }

  next();
};