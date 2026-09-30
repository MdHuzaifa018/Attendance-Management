import ExamMark from "../models/ExamMark.js";
import Student from "../models/Student.js";

// Student apne marks dekhta hai
export const getMyMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const marks = await ExamMark.find({ student: student._id })
      .populate("subject", "name code credits")
      .populate("gradedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin ya Teacher kisi bhi student ke marks dekhta hai
export const getStudentMarks = async (req, res) => {
  try {
    const marks = await ExamMark.find({ student: req.params.studentId })
      .populate("subject", "name code credits")
      .populate("gradedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Teacher ya Admin marks record karta hai
// Agar same student + subject + examType pehle se hai, update hoga — warna naya create hoga
export const recordMark = async (req, res) => {
  try {
    const { studentId, subjectId, examType, maxMarks, marksObtained, remarks } = req.body;

    if (!studentId || !subjectId || marksObtained === undefined) {
      return res.status(400).json({ success: false, message: "studentId, subjectId aur marksObtained required hai" });
    }

    if (marksObtained > (maxMarks || 100)) {
      return res.status(400).json({ success: false, message: "Marks obtained max marks se zyada nahi ho sakta" });
    }

    const mark = await ExamMark.findOneAndUpdate(
      {
        student: studentId,
        subject: subjectId,
        examType: examType || "Internal Assessment",
      },
      {
        $set: {
          maxMarks: maxMarks || 100,
          marksObtained,
          remarks,
          gradedBy: req.user._id,
        },
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("subject", "name code");

    res.status(200).json({ success: true, message: "Marks recorded successfully", data: mark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
