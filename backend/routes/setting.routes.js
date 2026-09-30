import express from "express";
import Setting from "../models/Setting.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

const DEFAULT_SETTINGS = {
  key: "college_settings",
  collegeName: "NALANDA COLLEGE",
  tagline: "Attendance & Academic Management System",
  affilText: "(A Constituent Unit of Patliputra University, Patna)",
  locationText: "Biharsharif, Nalanda- 803101 (Bihar)",
  estdText: "Estd. 1870",
  logo: "/logo.png",
};

// GET /api/settings - Public: get current college logo and details
router.get("/", async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: "college_settings" });
    if (!setting) {
      setting = await Setting.create(DEFAULT_SETTINGS);
    }
    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings - Admin only: update college logo & particulars
router.put("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { logo, collegeName, tagline, affilText, locationText, estdText } = req.body;

    const updates = {};
    if (logo !== undefined) updates.logo = logo || "/logo.png";
    if (collegeName !== undefined) updates.collegeName = collegeName.trim();
    if (tagline !== undefined) updates.tagline = tagline.trim();
    if (affilText !== undefined) updates.affilText = affilText.trim();
    if (locationText !== undefined) updates.locationText = locationText.trim();
    if (estdText !== undefined) updates.estdText = estdText.trim();
    updates.updatedBy = req.user?._id;

    const setting = await Setting.findOneAndUpdate(
      { key: "college_settings" },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Logo and college settings updated successfully",
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings/reset-logo - Admin only: reset logo to default
router.post("/reset-logo", protect, authorize("admin"), async (req, res, next) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: "college_settings" },
      { $set: { logo: "/logo.png", updatedBy: req.user?._id } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Logo reset to default successfully",
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
