import express from "express";
import { getSessions, getActiveSession, createSession, updateSession } from "../controllers/academicSession.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/active", getActiveSession);
router.get("/", getSessions);

router.use(authorize("admin"));
router.post("/", createSession);
router.put("/:id", updateSession);

export default router;
