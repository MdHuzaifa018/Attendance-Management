/**
 * authorize(...roles)
 *
 * Role-based authorization middleware factory.
 * Must be used AFTER the protect middleware (which sets req.user).
 *
 * Takes one or more allowed roles and returns an Express middleware
 * that checks if the authenticated user's role is in the allowed list.
 *
 * Usage:
 *   router.get("/admin-only", protect, authorize("admin"), handler);
 *   router.get("/staff",      protect, authorize("admin", "teacher"), handler);
 *
 * Security note: protect is the authentication boundary (who are you?).
 *               authorize is the authorization boundary (what can you do?).
 *               Backend authorization is the real security wall — never rely
 *               only on frontend route guards.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the protect middleware
    if (!req.user) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`
      );
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};