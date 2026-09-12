export const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  let statusCode =
    error.statusCode || 500;

  let message =
    error.message || "Internal server error";

  // Zod validation error
  if (error.name === "ZodError") {
    statusCode = 400;

    message = error.issues
      .map((issue) => issue.message)
      .join(", ");
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 409;

    const field =
      Object.keys(error.keyValue)[0];

    message = `${field} already exists`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};