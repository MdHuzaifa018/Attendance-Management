import ExamMark from "../models/ExamMark.js";
import Student from "../models/Student.js";

// GET /api/marks/my — Student views their own marks
export const getMyMarks = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).lean();
  if (!student) {
    const err = new Error("Student record not found");
    err.statusCode = 404;
    throw err;
  }

  const marks = await ExamMark.find({ student: student._id })
    .populate("subject", "name code credits")
    .populate("gradedBy", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: marks });
};

// GET /api/marks/student/:studentId — Admin or teacher views any student's marks
export const getStudentMarks = async (req, res) => {
  const marks = await ExamMark.find({ student: req.params.studentId })
    .populate("subject", "name code credits")
    .populate("gradedBy", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: marks });
};

// POST /api/marks — Teacher or admin records/updates marks (upsert by student+subject+examType)
export const recordMark = async (req, res) => {
  const { studentId, subjectId, examType, maxMarks, marksObtained, remarks } = req.body;

  if (!studentId || !subjectId || marksObtained === undefined) {
    const err = new Error("studentId, subjectId, and marksObtained are required");
    err.statusCode = 400;
    throw err;
  }

  if (marksObtained > (maxMarks || 100)) {
    const err = new Error("Marks obtained cannot exceed maximum marks");
    err.statusCode = 400;
    throw err;
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
};
