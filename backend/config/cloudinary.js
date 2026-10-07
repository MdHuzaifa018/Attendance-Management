import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary SDK with environment variables (trimmed for safety)
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
  secure: true,
});

/**
 * Checks if Cloudinary credentials are fully defined in environment variables.
 */
export const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return Boolean(
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_KEY !== "your_api_key" &&
    CLOUDINARY_API_SECRET &&
    CLOUDINARY_API_SECRET !== "your_api_secret"
  );
};

/**
 * Upload a file buffer directly to Cloudinary using upload_stream (zero disk storage).
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Cloudinary upload options (folder, etc.)
 * @returns {Promise<Object>} - Cloudinary upload result object
 */
export const uploadStreamToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          "Cloudinary credentials missing or invalid in backend/.env. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        )
      );
    }

    const uploadOptions = {
      resource_type: "image",
      folder: "attendance_management",
      // Auto-optimization: automatically serve optimal format (WebP/AVIF) and quality
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ],
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by public ID.
 * @param {string} publicId - The public ID of the resource
 * @returns {Promise<Object|null>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    return null;
  }
};

export default cloudinary;
