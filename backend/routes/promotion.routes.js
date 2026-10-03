import express from "express";
import { getPromotionPreview, executePromotion } from "../controllers/promotion.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

// GET /api/promotions/preview?currentSessionId=...&targetSessionId=...&fromClassId=...
router.get("/preview", getPromotionPreview);

// POST /api/promotions/execute
router.post("/execute", executePromotion);

export default router;
