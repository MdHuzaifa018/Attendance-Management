import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },

    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "At least one department is required"],
      }
    ],

    phone: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
      default: "Teacher",
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

teacherSchema.index({ isActive: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;