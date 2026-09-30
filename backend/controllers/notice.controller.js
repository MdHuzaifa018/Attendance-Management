import Notice from "../models/Notice.js";

// Notices fetch karna — role ke hisaab se filter hota hai
export const getNotices = async (req, res) => {
  try {
    const role = req.user?.role || "student";
    const filter = { isActive: true };

    if (role === "student") {
      // Student ko sirf "all" ya "student" wale notices dikhenge
      filter.$or = [{ targetRole: "all" }, { targetRole: "student" }];
    } else if (role === "teacher") {
      // Teacher ko general + faculty + student notices dikhenge
      filter.$or = [{ targetRole: "all" }, { targetRole: "teacher" }, { targetRole: "student" }];
    }
    // Admin ko sabhi notices bina filter ke dikhenge

    const notices = await Notice.find(filter)
      .populate("postedBy", "name email role")
      .sort({ priority: -1, createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Naya notice create karna (Admin only)
export const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, targetRole } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title aur content required hai" });
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

    const result = await Notice.findById(notice._id).populate("postedBy", "name email");

    res.status(201).json({ success: true, message: "Notice posted successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Notice active/inactive toggle karna (Admin only)
export const toggleNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    notice.isActive = !notice.isActive;
    await notice.save();

    const status = notice.isActive ? "activated" : "deactivated";
    res.status(200).json({ success: true, message: `Notice ${status} successfully`, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Notice delete karna (Admin only)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
