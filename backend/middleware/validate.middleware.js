import { ZodError } from "zod";

/**
 * validate(schema)
 *
 * Factory middleware. Takes a Zod schema and returns an Express middleware
 * that validates req.body against it.
 *
 * On success  → replaces req.body with the parsed/sanitized data and calls next()
 * On failure  → calls next() with a ZodError which the error handler formats
 *               into { success: false, message: "..." }
 *
 * Usage:
 *   router.post("/register", validate(registerSchema), register);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Pass the ZodError to the centralized error handler
    return next(result.error);
  }

  // Replace req.body with the parsed/sanitized value (trimmed strings etc.)
  req.body = result.data;
  next();
};

export default validate;