import * as teacherService from "../services/teacher.service.js";

/**
 * Teacher controllers — thin wrappers over teacher.service.js.
 * Express 5: async errors automatically handled by errorHandler middleware.
 */

// GET /api/teachers?search=&departmentId=&page=1&limit=20
export const getTeachers = async (req, res) => {
  const { search, departmentId, page = 1, limit = 20 } = req.query;

  const result = await teacherService.getAllTeachers({
    search,
    departmentId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/teachers/:id
export const getTeacher = async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  res.status(200).json({ success: true, teacher });
};

// POST /api/teachers
export const createTeacher = async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json({
    success: true,
    message: "Teacher created successfully",
    teacher,
  });
};

// PUT /api/teachers/:id
export const updateTeacher = async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Teacher updated successfully",
    teacher,
  });
};

// DELETE /api/teachers/:id
export const deleteTeacher = async (req, res) => {
  const result = await teacherService.deleteTeacher(req.params.id);
  res.status(200).json({ success: true, ...result });
};
