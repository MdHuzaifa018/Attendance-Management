import mongoose from "mongoose";

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