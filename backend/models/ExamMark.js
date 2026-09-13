import mongoose from "mongoose";

const examMarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examType: {
      type: String,
      enum: ["Internal Assessment", "Mid-Term Examination", "Final Assessment", "Practical Lab Exam"],
      default: "Internal Assessment",
    },
    maxMarks: {
      type: Number,
      default: 100,
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

examMarkSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

const ExamMark = mongoose.model("ExamMark", examMarkSchema);

export default ExamMark;
