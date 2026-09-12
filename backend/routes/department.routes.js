import express from "express";
import Department from "../models/Department.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/departments
 * Returns all active departments sorted by name.
 * Used by admin student/teacher forms for dropdowns.
 * Phase 8 will add full CRUD for departments.
 */
router.get("/", protect, async (req, res) => {
  const departments = await Department.find({ isActive: true })
    .select("_id name code")
    .sort({ name: 1 });

  res.status(200).json({ success: true, departments });
});

export default router;
