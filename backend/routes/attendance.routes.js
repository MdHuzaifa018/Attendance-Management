import express from "express";
import {
  getAttendanceSheet,
  submitAttendance,
  getAssignedSubjects,
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  getSheetQuerySchema,
  markAttendanceSchema,
} from "../validators/attendance.validator.js";

const router = express.Router();

// All attendance routes require authentication
router.use(protect);

// GET /api/attendance/assigned-subjects — Get current teacher's assigned subjects (or all for admin)
router.get(
  "/assigned-subjects",
  authorize("teacher", "admin"),
  getAssignedSubjects
);

// GET /api/attendance/sheet — Load daily marking sheet for a class & subject
router.get(
  "/sheet",
  authorize("teacher", "admin"),
  validate(getSheetQuerySchema, "query"),
  getAttendanceSheet
);

// POST /api/attendance/mark — Submit bulk attendance records
router.post(
  "/mark",
  authorize("teacher", "admin"),
  validate(markAttendanceSchema),
  submitAttendance
);

export default router;
