import express from "express";
import { getSessions, getActiveSession, createSession, updateSession, deleteSession } from "../controllers/academicSession.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Public read endpoints (needed by login page, home page, and public session switcher)
router.get("/active", getActiveSession);
router.get("/", getSessions);

// Mutation routes require authentication and admin privileges
router.use(protect);
router.use(authorize("admin"));
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
