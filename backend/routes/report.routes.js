import express from "express";
import {
  getOverview,
  getTrends,
  getDetailedReport,
  getStudentDetailedReport,
  exportCSV,
} from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { reportQuerySchema } from "../validators/report.validator.js";

const router = express.Router();

// All reporting endpoints are restricted to 'admin'
router.use(protect, authorize("admin"));

// GET /api/reports/overview — high-level metrics for dashboard
router.get("/overview", getOverview);

// GET /api/reports/trends — daily attendance percentages for charting
router.get("/trends", getTrends);

// GET /api/reports/detailed — tabular data for AdminReportsPage
router.get("/detailed", validate(reportQuerySchema, "query"), getDetailedReport);

// GET /api/reports/student/:studentId — specific student stats (used for bulk attendance override)
router.get("/student/:studentId", getStudentDetailedReport);

// GET /api/reports/export — downloads the detailed data as a CSV file
router.get("/export", validate(reportQuerySchema, "query"), exportCSV);

export default router;
