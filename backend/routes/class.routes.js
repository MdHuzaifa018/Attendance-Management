import express from "express";
import Class from "../models/Class.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/classes?departmentId=...
 * Returns all active classes, optionally filtered by department.
 * Sorted by name. Used by admin student/teacher forms for dropdowns.
 * Phase 8 will add full CRUD for classes.
 */
router.get("/", protect, async (req, res) => {
  const { departmentId } = req.query;

  const filter = { isActive: true };
  if (departmentId) filter.department = departmentId;

  const classes = await Class.find(filter)
    .select("_id name code department")
    .populate("department", "name code")
    .sort({ name: 1 });

  res.status(200).json({ success: true, classes });
});

export default router;
