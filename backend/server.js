import dotenv from "dotenv";
dotenv.config(); // Must be first — loads env before any other import reads it

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import classRoutes from "./routes/class.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import attendanceHistoryRoutes from "./routes/attendanceHistory.routes.js";
import studentAttendanceRoutes from "./routes/studentAttendance.routes.js";
import reportRoutes from "./routes/report.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import timetableRoutes from "./routes/timetable.routes.js";
import marksRoutes from "./routes/marks.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));       // Reject absurdly large bodies
app.use(express.urlencoded({ extended: false }));

// ── Logging (dev only) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ── Health Checks ───────────────────────────────────────────────────────────
app.get("/", (req, res) => res.status(200).send("API is live"));
app.head("/", (req, res) => res.status(200).end());
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Nalanda ERP API is running" });
});

// ── Public Routes (no auth needed) ─────────────────────────────────────────
app.use("/api/public", publicRoutes);

// ── Protected API Routes ────────────────────────────────────────────────────
app.use("/api/auth",                authRoutes);
app.use("/api/students",            studentRoutes);
app.use("/api/teachers",            teacherRoutes);
app.use("/api/departments",         departmentRoutes);
app.use("/api/classes",             classRoutes);
app.use("/api/subjects",            subjectRoutes);
app.use("/api/attendance",          attendanceRoutes);
app.use("/api/attendance/history",  attendanceHistoryRoutes);
app.use("/api/student-attendance",  studentAttendanceRoutes);
app.use("/api/reports",             reportRoutes);
app.use("/api/notices",             noticeRoutes);
app.use("/api/leaves",              leaveRoutes);
app.use("/api/timetable",           timetableRoutes);
app.use("/api/marks",               marksRoutes);

// ── Error Handling (must be last) ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error(`❌ Server startup failed: ${err.message}`);
    process.exit(1);
  }
};

startServer();
