import Leave from "../models/Leave.js";
import Student from "../models/Student.js";

/**
 * Leave Controller
 * Handles student leave requests, tracking, and faculty/admin approval.
 */

// POST /api/leaves (Student applies for leave)
export const applyLeave = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    const { leaveType, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Start date, end date, and reason are required" });
    }

    const leave = await Leave.create({
      student: student._id,
      leaveType: leaveType || "Medical",
      startDate,
      endDate,
      reason,
    });

    const populated = await Leave.findById(leave._id)
      .populate({
        path: "student",
        populate: [
          { path: "user", select: "name email" },
          { path: "class", select: "name code" },
        ],
      });

    res.status(201).json({ success: true, message: "Leave application submitted successfully", data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leaves/my (Student views their leaves)
export const getMyLeaves = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    const leaves = await Leave.find({ student: student._id })
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leaves (Admin/Teacher view all leaves)
export const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate({
        path: "student",
        populate: [
          { path: "user", select: "name email" },
          { path: "class", select: "name code" },
          { path: "department", select: "name code" },
        ],
      })
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/leaves/:id/review (Admin/Teacher approves/rejects)
export const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave application not found" });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    if (reviewNote) leave.reviewNote = reviewNote;
    await leave.save();

    const updated = await Leave.findById(leave._id)
      .populate({
        path: "student",
        populate: [{ path: "user", select: "name email" }],
      })
      .populate("reviewedBy", "name");

    res.status(200).json({ success: true, message: `Leave ${status} successfully`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
