import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Class code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot be greater than 8"],
    },

    section: {
      type: String,
      default: "A",
      uppercase: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
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

classSchema.index({ isActive: 1 });

const Class = mongoose.model("Class", classSchema);

export default Class;