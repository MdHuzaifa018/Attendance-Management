import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
} from "../controllers/leave.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// Student routes
router.post("/apply", authorize("student"), applyLeave);
router.get("/my", authorize("student"), getMyLeaves);

// Admin & Teacher routes
router.get("/", authorize("admin", "teacher"), getAllLeaves);
router.patch("/:id/review", authorize("admin", "teacher"), reviewLeave);

export default router;
