// Generates a 404 error for any route that doesn't match a defined handler.
export const notFound = (req, res, next) => {
  const err = new Error(`Not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// Central error handler — all thrown errors in services/controllers land here.
// Express 5 automatically forwards async errors without needing try/catch.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Zod validation failure (from validate.middleware.js)
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.issues.map((i) => i.message).join(", ");
  }

  // MongoDB duplicate key (e.g., unique email or roll number)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Mongoose cast error (e.g., invalid ObjectId in URL param)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // Only log 5xx errors — 4xx errors are expected client mistakes
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(statusCode).json({ success: false, message });
};