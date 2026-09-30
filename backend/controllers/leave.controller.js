import Leave from "../models/Leave.js";
import Student from "../models/Student.js";

// POST /api/leaves — Student submits a leave request
export const applyLeave = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).lean();
  if (!student) {
    const err = new Error("Student record not found for your account");
    err.statusCode = 404;
    throw err;
  }

  const { leaveType, startDate, endDate, reason } = req.body;
  if (!startDate || !endDate || !reason) {
    const err = new Error("startDate, endDate, and reason are required");
    err.statusCode = 400;
    throw err;
  }

  const leave = await Leave.create({
    student: student._id,
    leaveType: leaveType || "Medical",
    startDate,
    endDate,
    reason,
  });

  const populated = await Leave.findById(leave._id).populate({
    path: "student",
    populate: [
      { path: "user", select: "name email" },
      { path: "class", select: "name code" },
    ],
  });

  res.status(201).json({ success: true, message: "Leave application submitted", data: populated });
};

// GET /api/leaves/my — Student views their own leaves
export const getMyLeaves = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).lean();
  if (!student) {
    const err = new Error("Student record not found");
    err.statusCode = 404;
    throw err;
  }

  const leaves = await Leave.find({ student: student._id })
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: leaves });
};

// GET /api/leaves — Admin/Teacher views all leave requests
export const getAllLeaves = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

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
};

// PATCH /api/leaves/:id/review — Admin/Teacher approves or rejects
export const reviewLeave = async (req, res) => {
  const { status, reviewNote } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    const err = new Error("Status must be 'approved' or 'rejected'");
    err.statusCode = 400;
    throw err;
  }

  const leave = await Leave.findById(req.params.id);
  if (!leave) {
    const err = new Error("Leave application not found");
    err.statusCode = 404;
    throw err;
  }

  leave.status = status;
  leave.reviewedBy = req.user._id;
  if (reviewNote) leave.reviewNote = reviewNote;
  await leave.save();

  const updated = await Leave.findById(leave._id)
    .populate({ path: "student", populate: [{ path: "user", select: "name email" }] })
    .populate("reviewedBy", "name");

  res.status(200).json({ success: true, message: `Leave ${status} successfully`, data: updated });
};
