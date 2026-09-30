import api from "./api.js";

/**
 * Fetch current college identity & logo settings
 */
export const getCollegeSettings = async () => {
  const response = await api.get("/settings");
  return response.data.data;
};

/**
 * Update college identity, details, or logo
 */
export const updateCollegeSettings = async (settingsData) => {
  const response = await api.put("/settings", settingsData);
  return response.data.data;
};

/**
 * Reset logo back to default /logo.png
 */
export const resetCollegeLogo = async () => {
  const response = await api.post("/settings/reset-logo");
  return response.data.data;
};
