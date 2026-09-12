import * as reportService from "../services/report.service.js";

/**
 * Report Controller
 * Provides system-wide analytics, trends, detailed reporting, and CSV exports for admins.
 */

// GET /api/reports/overview
export const getOverview = async (req, res) => {
  const result = await reportService.getSystemOverview();
  res.status(200).json({ success: true, data: result });
};

// GET /api/reports/trends
export const getTrends = async (req, res) => {
  // default to last 7 days
  const days = req.query.days ? parseInt(req.query.days) : 7;
  const result = await reportService.getAttendanceTrends(days);
  res.status(200).json({ success: true, data: result });
};

// GET /api/reports/detailed
export const getDetailedReport = async (req, res) => {
  const filters = req.validatedQuery || req.query;
  const result = await reportService.getDetailedReport(filters);
  res.status(200).json({ success: true, data: result });
};

// GET /api/reports/export
export const exportCSV = async (req, res) => {
  const filters = req.validatedQuery || req.query;
  const data = await reportService.getDetailedReport(filters);

  // Generate CSV String
  const headers = [
    "Student Name",
    "Roll No",
    "Class",
    "Subject",
    "Total Conducted",
    "Attended",
    "Absent",
    "Percentage",
    "Status"
  ];

  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    // Determine status text based on percent
    let statusText = "Critical";
    if (row.percent >= 75) statusText = "Good";
    else if (row.percent >= 50) statusText = "Warning";

    const values = [
      `"${row.studentName || ""}"`,
      `"${row.rollNo || ""}"`,
      `"${row.className || ""}"`,
      `"${row.subjectName || ""} (${row.subjectCode || ""})"`,
      row.totalConducted,
      row.present,
      row.absent,
      `${row.percent}%`,
      `"${statusText}"`
    ];
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="attendance-report-${new Date().toISOString().split("T")[0]}.csv"`
  );

  res.status(200).send(csvString);
};
