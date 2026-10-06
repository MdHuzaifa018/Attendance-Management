import api from "./api";

/**
 * Upload an image file to Cloudinary via backend stream API
 * @param {File} file - The image file selected by user
 * @param {string} folder - Target folder on Cloudinary (e.g. 'students/photos', 'students/signatures', 'college/logo')
 * @returns {Promise<{ success: boolean, data: { url: string, public_id: string, width: number, height: number } }>}
 */
export const uploadImageToCloudinary = async (file, folder = "general") => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(
    `/upload/image?folder=${encodeURIComponent(folder)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/**
 * Check if Cloudinary service is configured and ready on backend
 */
export const checkUploadStatus = async () => {
  const response = await api.get("/upload/status");
  return response.data;
};
