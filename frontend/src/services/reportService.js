import api from "./api.js";

/**
 * Report Service
 * API client for admin analytics, charting data, and CSV exports.
 */

export const getSystemOverview = async () => {
  const { data } = await api.get("/reports/overview");
  return data.data;
};

export const getAttendanceTrends = async (days = 7) => {
  const { data } = await api.get("/reports/trends", { params: { days } });
  return data.data;
};

export const getDetailedReport = async (filters = {}) => {
  const { data } = await api.get("/reports/detailed", { params: filters });
  return data.data;
};

export const getStudentDetailedReport = async (studentId) => {
  const { data } = await api.get(`/reports/student/${studentId}`);
  return data.data;
};

/**
 * Downloads the CSV report by invoking the export endpoint.
 * We use `window.open` or create an anchor tag, or fetch it as a blob.
 * Fetching as a blob is safer for passing auth headers (handled by interceptor).
 */
export const downloadCSVReport = async (filters = {}) => {
  try {
    const response = await api.get("/reports/export", {
      params: filters,
      responseType: "blob", // Important: telling Axios to handle the response as a blob
    });

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    
    // Extract filename from Content-Disposition header if available
    let fileName = "attendance-report.csv";
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Failed to download CSV report");
  }
};
