import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Subject code is required"],
      uppercase: true,
      trim: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },

    totalClasses: {
      type: Number,
      default: 0,
      min: 0,
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

subjectSchema.index(
  { code: 1, class: 1 },
  { unique: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;