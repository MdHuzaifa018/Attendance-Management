import mongoose from "mongoose";

const editEntrySchema = new mongoose.Schema(
  {
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedByRole: { type: String, required: true },
    previousStatus: { type: String, enum: ["present", "absent"], required: true },
    newStatus: { type: String, enum: ["present", "absent"], required: true },
    reason: { type: String, trim: true, maxlength: 300 },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },

    date: {
      type: Date,
      required: [true, "Attendance date is required"],
    },

    session: {
      type: String,
      default: "regular",
      trim: true,
    },

    status: {
      type: String,
      enum: ["present", "absent"],
      required: [true, "Attendance status is required"],
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },

    // Audit trail: every manual correction is appended here
    editHistory: {
      type: [editEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  {
    student: 1,
    class: 1,
    subject: 1,
    date: 1,
    session: 1,
  },
  {
    unique: true,
  }
);

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

export default Attendance;