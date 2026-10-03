import mongoose from "mongoose";

const academicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String, // e.g., "2026-27"
      required: [true, "Session name is required"],
      unique: true,
      trim: true,
    },
    startYear: {
      type: Number,
      required: [true, "Start year is required"],
    },
    endYear: {
      type: Number,
      required: [true, "End year is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one session can be marked as current
academicSessionSchema.pre("save", async function () {
  if (this.isCurrent) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
});

const AcademicSession = mongoose.model("AcademicSession", academicSessionSchema);
export default AcademicSession;
