import * as studentService from "../services/student.service.js";

/**
 * Student controllers — thin wrappers over the service layer.
 * All business logic, validation, and DB operations live in student.service.js.
 * Express 5: async errors automatically forwarded to errorHandler middleware.
 */

// GET /api/students?search=&classId=&departmentId=&page=1&limit=20
export const getStudents = async (req, res) => {
  const { search, classId, departmentId, page = 1, limit = 20 } = req.query;

  const result = await studentService.getAllStudents({
    search,
    classId,
    departmentId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/students/:id
export const getStudent = async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  res.status(200).json({ success: true, student });
};

// POST /api/students
export const createStudent = async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json({
    success: true,
    message: "Student created successfully",
    student,
  });
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    student,
  });
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);
  res.status(200).json({ success: true, ...result });
};
