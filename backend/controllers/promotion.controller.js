import * as promotionService from "../services/promotion.service.js";

export const getPromotionPreview = async (req, res) => {
  try {
    const { currentSessionId, targetSessionId, fromClassId } = req.query;
    if (!currentSessionId || !targetSessionId || !fromClassId) {
      return res.status(400).json({ success: false, message: "Missing required parameters." });
    }

    const data = await promotionService.getPromotionPreview({ currentSessionId, targetSessionId, fromClassId });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const executePromotion = async (req, res) => {
  try {
    const { currentSessionId, targetSessionId, promotions } = req.body;
    
    if (!currentSessionId || !targetSessionId || !promotions || !Array.isArray(promotions)) {
      return res.status(400).json({ success: false, message: "Invalid payload." });
    }

    const result = await promotionService.executePromotion({
      currentSessionId,
      targetSessionId,
      promotions,
      performedBy: req.user._id,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const revertPromotion = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await promotionService.revertPromotion(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
