import express from "express";
import {
  listSessions,
  getSessionDetail,
  correctRecord,
  getAuditLog,
} from "../controllers/attendanceHistory.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  historyQuerySchema,
  sessionDetailQuerySchema,
  correctAttendanceSchema,
} from "../validators/attendanceHistory.validator.js";

const router = express.Router();

// All history routes require authentication
router.use(protect);

// GET /api/attendance/history — paginated session list with stats
router.get(
  "/",
  authorize("teacher", "admin"),
  validate(historyQuerySchema, "query"),
  listSessions
);

// GET /api/attendance/history/session — all student records for one session
router.get(
  "/session",
  authorize("teacher", "admin"),
  validate(sessionDetailQuerySchema, "query"),
  getSessionDetail
);

// PATCH /api/attendance/history/correct — correct a single attendance record
router.patch(
  "/correct",
  authorize("teacher", "admin"),
  validate(correctAttendanceSchema),
  correctRecord
);

// GET /api/attendance/history/audit — full audit log (admin only)
router.get(
  "/audit",
  authorize("admin"),
  validate(historyQuerySchema, "query"),
  getAuditLog
);

export default router;
