import express from "express";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../validators/subject.validator.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/subjects — list (paginated, classId filter, teacherId filter, or all=true)
router.get("/", getSubjects);

// GET /api/subjects/:id — single subject details
router.get("/:id", getSubject);

// Admin-only management endpoints
router.post(
  "/",
  authorize("admin"),
  validate(createSubjectSchema),
  createSubject
);

router.put(
  "/:id",
  authorize("admin"),
  validate(updateSubjectSchema),
  updateSubject
);

router.delete("/:id", authorize("admin"), deleteSubject);

export default router;
