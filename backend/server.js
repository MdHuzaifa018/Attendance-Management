import dotenv from "dotenv";
dotenv.config(); // Sabse pehle env load karo

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Saare routes import karna
import authRoutes            from "./routes/auth.routes.js";
import studentRoutes         from "./routes/student.routes.js";
import teacherRoutes         from "./routes/teacher.routes.js";
import departmentRoutes      from "./routes/department.routes.js";
import classRoutes           from "./routes/class.routes.js";
import subjectRoutes         from "./routes/subject.routes.js";
import attendanceRoutes      from "./routes/attendance.routes.js";
import attendanceHistoryRoutes from "./routes/attendanceHistory.routes.js";
import studentAttendanceRoutes from "./routes/studentAttendance.routes.js";
import reportRoutes          from "./routes/report.routes.js";
import noticeRoutes          from "./routes/notice.routes.js";
import leaveRoutes           from "./routes/leave.routes.js";
import timetableRoutes       from "./routes/timetable.routes.js";
import marksRoutes           from "./routes/marks.routes.js";
import publicRoutes          from "./routes/public.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(helmet());                             // Security headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "25mb" }));      // JSON body parser (supports photo & signature uploads)
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(morgan("dev"));                        // Request logging

// Health check routes
app.get("/", (req, res) => res.status(200).send("API is live"));
app.get("/api/health", (req, res) => res.json({ success: true, message: "Server is running" }));

// Public routes — login ki zaroorat nahi
app.use("/api/public", publicRoutes);

// Protected routes — login + JWT token required
app.use("/api/auth",               authRoutes);
app.use("/api/students",           studentRoutes);
app.use("/api/teachers",           teacherRoutes);
app.use("/api/departments",        departmentRoutes);
app.use("/api/classes",            classRoutes);
app.use("/api/subjects",           subjectRoutes);
app.use("/api/attendance",         attendanceRoutes);
app.use("/api/attendance/history", attendanceHistoryRoutes);
app.use("/api/student-attendance", studentAttendanceRoutes);
app.use("/api/reports",            reportRoutes);
app.use("/api/notices",            noticeRoutes);
app.use("/api/leaves",             leaveRoutes);
app.use("/api/timetable",          timetableRoutes);
app.use("/api/marks",              marksRoutes);

// Error handling middleware — sab errors yahan aate hain
app.use(notFound);
app.use(errorHandler);

// Server start karna
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();
