import express from "express";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../validators/student.validator.js";

const router = express.Router();

// All student routes require authentication + admin role
router.use(protect, authorize("admin"));

// GET  /api/students  — list with search/filter/pagination
router.get("/", getStudents);

// GET  /api/students/:id  — get single student
router.get("/:id", getStudent);

// POST /api/students  — create (also creates a User account)
router.post("/", validate(createStudentSchema), createStudent);

// PUT  /api/students/:id  — update student profile
router.put("/:id", validate(updateStudentSchema), updateStudent);

// DELETE /api/students/:id  — hard delete (removes Student + User)
router.delete("/:id", deleteStudent);

export default router;
