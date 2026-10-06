import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { uploadImageMiddleware } from "../middleware/upload.middleware.js";
import {
  uploadStreamToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
} from "../config/cloudinary.js";

const router = express.Router();

/**
 * GET /api/upload/status
 * Check if Cloudinary is configured and ready
 */
router.get("/status", protect, (req, res) => {
  const configured = isCloudinaryConfigured();
  return res.status(200).json({
    success: true,
    configured,
    cloudName: configured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    message: configured
      ? "Cloudinary media service is configured and active."
      : "Cloudinary credentials missing in backend/.env.",
  });
});

/**
 * POST /api/upload/image
 * Upload image to Cloudinary via memory stream buffer
 */
router.post("/image", protect, uploadImageMiddleware, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided. Please attach an image in 'image' or 'file' form field.",
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message:
          "Cloudinary credentials not configured in backend/.env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    // Determine target folder based on request query/body
    const rawFolder = req.query.folder || req.body.folder || "general";
    // Sanitize folder to avoid directory traversal
    const safeFolder = rawFolder.replace(/[^a-zA-Z0-9_\-\/]/g, "");
    const targetFolder = `nalanda_attendance/${safeFolder}`;

    // Upload directly from memory buffer
    const result = await uploadStreamToCloudinary(req.file.buffer, {
      folder: targetFolder,
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/upload/image
 * Remove image from Cloudinary (Admin only)
 */
router.delete("/image", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required to delete image from Cloudinary",
      });
    }

    const result = await deleteFromCloudinary(public_id);
    return res.status(200).json({
      success: true,
      message: "Image deleted from Cloudinary",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
