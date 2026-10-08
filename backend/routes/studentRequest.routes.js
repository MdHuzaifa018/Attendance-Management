import express from "express";
import {
  getRequests,
  getPendingCount,
  approveRequest,
  rejectRequest,
} from "../controllers/studentRequest.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes require Admin privileges
router.use(protect);
router.use(authorize("admin"));

// GET /api/student-requests — list all requests
router.get("/", getRequests);

// GET /api/student-requests/count — badge count of pending applications
router.get("/count", getPendingCount);

// PUT /api/student-requests/:id/approve — 1-click approve & auto-enroll
router.put("/:id/approve", approveRequest);

// PUT /api/student-requests/:id/reject — reject application with reason
router.put("/:id/reject", rejectRequest);

export default router;
