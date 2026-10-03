import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Program code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    durationYears: {
      type: Number,
      required: [true, "Duration in years is required"],
      min: 1,
    },
    totalSemesters: {
      type: Number,
      required: [true, "Total semesters is required"],
      min: 1,
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

const Program = mongoose.model("Program", programSchema);
export default Program;
