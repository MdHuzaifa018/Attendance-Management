import express from "express";
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createClassSchema,
  updateClassSchema,
} from "../validators/class.validator.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/classes — list (paginated, department filter, or all=true)
router.get("/", getClasses);

// GET /api/classes/:id — single class details
router.get("/:id", getClass);

// Admin-only management endpoints
router.post(
  "/",
  authorize("admin"),
  validate(createClassSchema),
  createClass
);

router.put(
  "/:id",
  authorize("admin"),
  validate(updateClassSchema),
  updateClass
);

router.delete("/:id", authorize("admin"), deleteClass);

export default router;
