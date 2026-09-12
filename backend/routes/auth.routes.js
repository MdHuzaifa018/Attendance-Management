import express from "express";

import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

// POST /api/auth/register  — public, validates body with Zod before controller
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login  — public, validates body with Zod before controller
router.post("/login", validate(loginSchema), login);

// GET /api/auth/me  — protected: requires valid JWT
router.get("/me", protect, getMe);

export default router;