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
import settingRoutes         from "./routes/setting.routes.js";
import academicSessionRoutes from "./routes/academicSession.routes.js";
import promotionRoutes       from "./routes/promotion.routes.js";
import uploadRoutes          from "./routes/upload.routes.js";
import studentRequestRoutes  from "./routes/studentRequest.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(helmet({ crossOriginResourcePolicy: false })); // Security headers

// Robust CORS for local dev (macOS / Windows / Linux)
const allowedOrigins = [
  process.env.CLIENT_URL?.trim(),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));       // JSON body parser (clean, optimized limit)
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan("dev"));                        // Request logging

// Health check routes
app.get("/", (req, res) => res.status(200).send("API is live"));
app.get("/api/health", (req, res) => res.json({ success: true, message: "Server is running" }));

// Public routes — login ki zaroorat nahi
app.use("/api/public", publicRoutes);
app.use("/api/settings", settingRoutes);

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
app.use("/api/academic-sessions",  academicSessionRoutes);
app.use("/api/promotions",         promotionRoutes);
app.use("/api/upload",             uploadRoutes);
app.use("/api/student-requests",   studentRequestRoutes);

// Error handling middleware — sab errors yahan aate hain
app.use(notFound);
app.use(errorHandler);

// Server start karna
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();
