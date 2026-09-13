import mongoose from "mongoose";

const periodSchema = new mongoose.Schema(
  {
    periodNumber: { type: Number, required: true },
    startTime: { type: String, required: true }, // e.g. "10:00 AM"
    endTime: { type: String, required: true },   // e.g. "11:00 AM"
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    roomNo: {
      type: String,
      default: "Room 101",
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
    },
    periods: [periodSchema],
  },
  {
    timestamps: true,
  }
);

timetableSchema.index({ class: 1, dayOfWeek: 1 }, { unique: true });

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
