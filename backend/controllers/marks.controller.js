import ExamMark from "../models/ExamMark.js";
import Student from "../models/Student.js";

/**
 * Marks Controller
 * Handles student internal assessments, exam marks, and academic performance cards.
 */

// GET /api/marks/my (Student views their marks)
export const getMyMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const marks = await ExamMark.find({ student: student._id })
      .populate("subject", "name code credits")
      .populate("gradedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/marks/student/:studentId (Admin or Teacher views marks of any student)
export const getStudentMarks = async (req, res) => {
  try {
    const marks = await ExamMark.find({ student: req.params.studentId })
      .populate("subject", "name code credits")
      .populate("gradedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/marks (Teacher or Admin records marks)
export const recordMark = async (req, res) => {
  try {
    const { studentId, subjectId, examType, maxMarks, marksObtained, remarks } = req.body;

    if (!studentId || !subjectId || marksObtained === undefined) {
      return res.status(400).json({
        success: false,
        message: "studentId, subjectId, and marksObtained are required",
      });
    }

    const mark = await ExamMark.findOneAndUpdate(
      {
        student: studentId,
        subject: subjectId,
        examType: examType || "Internal Assessment",
      },
      {
        student: studentId,
        subject: subjectId,
        examType: examType || "Internal Assessment",
        maxMarks: maxMarks || 100,
        marksObtained,
        remarks,
        gradedBy: req.user._id,
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("subject", "name code");

    res.status(200).json({
      success: true,
      message: "Marks recorded successfully",
      data: mark,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
