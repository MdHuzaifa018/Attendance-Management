import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Notice content is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["General", "Exam", "Attendance", "Holiday", "Event"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["normal", "high", "urgent"],
      default: "normal",
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "teacher"],
      default: "all",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ status: 1, createdAt: -1 });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
