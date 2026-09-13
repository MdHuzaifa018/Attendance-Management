import express from "express";
import {
  getNotices,
  createNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/notices — accessible to admin, teacher, student
router.get("/", getNotices);

// POST /api/notices — Admin only
router.post("/", authorize("admin"), createNotice);

// DELETE /api/notices/:id — Admin only
router.delete("/:id", authorize("admin"), deleteNotice);

export default router;
