import express from "express";
import {
  getAttendanceSummary,
  getAttendanceTimeline,
} from "../controllers/studentAttendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { timelineQuerySchema } from "../validators/studentAttendance.validator.js";

const router = express.Router();

// All student-attendance routes require authentication
router.use(protect);

// GET /api/student-attendance/summary — per-subject stats for logged-in student
router.get("/summary", authorize("student"), getAttendanceSummary);

// GET /api/student-attendance/timeline — date-wise records for logged-in student
router.get(
  "/timeline",
  authorize("student"),
  validate(timelineQuerySchema, "query"),
  getAttendanceTimeline
);

export default router;
