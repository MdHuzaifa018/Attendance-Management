import mongoose from "mongoose";

const promotionHistorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    fromEnrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    toEnrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      // Optional: can be null if action is 'graduated' or 'dropped' without new enrollment
    },
    fromAcademicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },
    toAcademicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      // Optional if graduating
    },
    fromYear: { type: Number },
    toYear: { type: Number },
    action: {
      type: String,
      enum: ["promoted", "graduated", "year_repeat", "transferred", "manually_adjusted"],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
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

const PromotionHistory = mongoose.model("PromotionHistory", promotionHistorySchema);
export default PromotionHistory;
