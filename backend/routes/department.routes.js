import express from "express";
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/departments — list (paginated or all=true for dropdowns)
router.get("/", getDepartments);

// GET /api/departments/:id — single department details
router.get("/:id", getDepartment);

// Admin-only modification routes
router.post(
  "/",
  authorize("admin"),
  validate(createDepartmentSchema),
  createDepartment
);

router.put(
  "/:id",
  authorize("admin"),
  validate(updateDepartmentSchema),
  updateDepartment
);

router.delete("/:id", authorize("admin"), deleteDepartment);

export default router;
