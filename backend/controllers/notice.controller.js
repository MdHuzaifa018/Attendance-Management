import Notice from "../models/Notice.js";

// GET /api/notices — Fetches notices filtered by the requester's role
export const getNotices = async (req, res) => {
  const role = req.user?.role || "student";
  const filter = { isActive: true };

  // Build role-based visibility filter:
  // - Students see notices for "all" or specifically for "student"
  // - Teachers see general + faculty + student notices
  // - Admins see everything (no extra filter)
  if (role === "student") {
    filter.$or = [{ targetRole: "all" }, { targetRole: "student" }];
  } else if (role === "teacher") {
    filter.$or = [{ targetRole: "all" }, { targetRole: "teacher" }, { targetRole: "student" }];
  }

  const notices = await Notice.find(filter)
    .populate("postedBy", "name email role")
    .sort({ priority: -1, createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json({ success: true, data: notices });
};

// POST /api/notices — Admin creates a new notice (admin only)
export const createNotice = async (req, res) => {
  const { title, content, category, priority, targetRole } = req.body;

  if (!title || !content) {
    const err = new Error("Title and content are required");
    err.statusCode = 400;
    throw err;
  }

  const notice = await Notice.create({
    title,
    content,
    category: category || "General",
    priority: priority || "normal",
    targetRole: targetRole || "all",
    postedBy: req.user._id,
    isActive: true,
  });

  const populated = await Notice.findById(notice._id).populate("postedBy", "name email").lean();

  res.status(201).json({ success: true, message: "Notice posted successfully", data: populated });
};

// PATCH /api/notices/:id — Admin toggles notice active/inactive status
export const toggleNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    const err = new Error("Notice not found");
    err.statusCode = 404;
    throw err;
  }

  notice.isActive = !notice.isActive;
  await notice.save();

  res.status(200).json({
    success: true,
    message: `Notice ${notice.isActive ? "activated" : "deactivated"} successfully`,
    data: { _id: notice._id, isActive: notice.isActive },
  });
};

// DELETE /api/notices/:id — Admin permanently deletes a notice
export const deleteNotice = async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    const err = new Error("Notice not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({ success: true, message: "Notice deleted successfully" });
};
