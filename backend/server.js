import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import requestLogger from "./middleware/requestLogger.js";
import connectDB from "./config/db.js";
import testRoutes from "./routes/test.route.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import classRoutes from "./routes/class.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import attendanceHistoryRoutes from "./routes/attendanceHistory.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());

app.use(morgan("dev"));

app.use(requestLogger);

app.use("/api/test", testRoutes);

//health check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Attendance Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance/history", attendanceHistoryRoutes);

app.use(notFound);

app.use(errorHandler);

// app.get("/api/test", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Test API is working",
//   });
// });

//start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`server startup error:${error.message}`);
    process.exit(1);
  }
};
startServer();
