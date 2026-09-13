import Notice from "../models/Notice.js";

/**
 * Notice Controller
 * Handles college notices, announcements, and urgent academic circulars.
 */

// GET /api/notices
export const getNotices = async (req, res) => {
  try {
    const role = req.user?.role || "student";
    const filter = { isActive: true };

    if (role !== "admin") {
      filter.$or = [{ targetRole: "all" }, { targetRole: role }];
    }

    const notices = await Notice.find(filter)
      .populate("postedBy", "name email role")
      .sort({ priority: -1, createdAt: -1 })
      .limit(30)
      .lean();

    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notices (Admin only)
export const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, targetRole } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const notice = await Notice.create({
      title,
      content,
      category: category || "General",
      priority: priority || "normal",
      targetRole: targetRole || "all",
      postedBy: req.user._id,
    });

    const populated = await Notice.findById(notice._id).populate("postedBy", "name email");

    res.status(201).json({
      success: true,
      message: "Notice broadcasted successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/notices/:id (Admin only)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Notice removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
