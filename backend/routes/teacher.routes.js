import express from "express";
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "../validators/teacher.validator.js";

const router = express.Router();

// All teacher management endpoints require authentication + admin role
router.use(protect, authorize("admin"));

// GET  /api/teachers  — list with search/department filter/pagination
router.get("/", getTeachers);

// GET  /api/teachers/:id  — get single teacher
router.get("/:id", getTeacher);

// POST /api/teachers  — create teacher + user account
router.post("/", validate(createTeacherSchema), createTeacher);

// PUT  /api/teachers/:id  — update teacher profile
router.put("/:id", validate(updateTeacherSchema), updateTeacher);

// DELETE /api/teachers/:id  — hard delete teacher + user account
router.delete("/:id", deleteTeacher);

export default router;
