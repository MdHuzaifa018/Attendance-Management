import Timetable from "../models/Timetable.js";

/**
 * Timetable Controller
 * Provides daily/weekly period routines for students and faculty.
 */

// GET /api/timetable
export const getTimetable = async (req, res) => {
  try {
    const { classId, dayOfWeek } = req.query;

    const filter = {};
    if (classId) filter.class = classId;
    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;

    const schedules = await Timetable.find(filter)
      .populate("class", "name code")
      .populate("periods.subject", "name code")
      .populate({
        path: "periods.teacher",
        populate: { path: "user", select: "name" },
      })
      .sort({ dayOfWeek: 1 })
      .lean();

    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/timetable (Admin creates or updates)
export const saveTimetable = async (req, res) => {
  try {
    const { classId, dayOfWeek, periods } = req.body;

    if (!classId || !dayOfWeek || !Array.isArray(periods)) {
      return res.status(400).json({
        success: false,
        message: "classId, dayOfWeek, and periods array are required",
      });
    }

    const timetable = await Timetable.findOneAndUpdate(
      { class: classId, dayOfWeek },
      { class: classId, dayOfWeek, periods },
      { upsert: true, new: true, runValidators: true }
    )
      .populate("periods.subject", "name code")
      .populate({
        path: "periods.teacher",
        populate: { path: "user", select: "name" },
      });

    res.status(200).json({
      success: true,
      message: `Timetable for ${dayOfWeek} saved successfully`,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
