import express from "express";
import {
  getMyMarks,
  getStudentMarks,
  recordMark,
} from "../controllers/marks.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// Student views their own marks
router.get("/my", authorize("student"), getMyMarks);

// Admin & Teacher can view any student's marks
router.get("/student/:studentId", authorize("admin", "teacher"), getStudentMarks);

// Admin & Teacher can enter or update marks
router.post("/", authorize("admin", "teacher"), recordMark);

export default router;
