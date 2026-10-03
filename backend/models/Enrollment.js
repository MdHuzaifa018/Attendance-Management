import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    year: {
      type: Number,
      default: 1, // 1st year, 2nd year, etc.
    },
    semester: {
      type: Number,
    },
    section: {
      type: String,
      default: "A",
    },
    rollNo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "graduated", "year_repeat", "transferred", "dropped", "inactive"],
      default: "active",
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    promotedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment", // Points to the previous year's enrollment
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment for the same student in the same academic session
enrollmentSchema.index(
  { student: 1, academicSession: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "dropped" } } }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
