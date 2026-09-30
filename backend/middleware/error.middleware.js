// 404 handler — koi bhi route match na ho to yahan aata hai
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global error handler — saare errors yahan handle hote hain
export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  // Zod validation error (invalid request body)
  if (error.name === "ZodError") {
    statusCode = 400;
    message = error.issues.map((i) => i.message).join(", ");
  }

  // MongoDB duplicate key error (e.g. same email ya roll number)
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // MongoDB invalid ID error (e.g. galat ObjectId URL me)
  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format`;
  }

  // Sirf server errors (5xx) log karo — client errors (4xx) expected hain
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, error.message);
  }

  res.status(statusCode).json({ success: false, message });
};