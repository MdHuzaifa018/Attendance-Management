import express from "express";
import {
  getTimetable,
  saveTimetable,
} from "../controllers/timetable.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// Accessible to all authenticated users (students, teachers, admins)
router.get("/", getTimetable);

// Only admin can configure or update timetable
router.post("/", authorize("admin"), saveTimetable);

export default router;
