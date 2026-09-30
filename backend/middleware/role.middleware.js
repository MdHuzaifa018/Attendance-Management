// authorize(...roles) — role-based access control middleware.
// Must be used AFTER `protect` (which sets req.user).
//
// Usage:
//   router.delete("/:id", protect, authorize("admin"), deleteHandler);
//   router.get("/",       protect, authorize("admin", "teacher"), listHandler);
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    const err = new Error("Authentication required");
    err.statusCode = 401;
    return next(err);
  }

  if (!roles.includes(req.user.role)) {
    const err = new Error(`Access denied. Allowed: ${roles.join(", ")}. Your role: ${req.user.role}`);
    err.statusCode = 403;
    return next(err);
  }

  next();
};