import * as classService from "../services/class.service.js";

/**
 * Class controllers.
 * Express 5 async error handling forwarding to errorHandler.
 */

// GET /api/classes?search=&departmentId=&page=1&limit=20&all=true
export const getClasses = async (req, res) => {
  const { search, departmentId, page = 1, limit = 20, all } = req.query;

  const result = await classService.getAllClasses({
    search,
    departmentId,
    page: Number(page),
    limit: Number(limit),
    all: all === "true",
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/classes/:id
export const getClass = async (req, res) => {
  const cls = await classService.getClassById(req.params.id);
  res.status(200).json({ success: true, class: cls });
};

// POST /api/classes
export const createClass = async (req, res) => {
  const cls = await classService.createClass(req.body);
  res.status(201).json({
    success: true,
    message: "Class created successfully",
    class: cls,
  });
};

// PUT /api/classes/:id
export const updateClass = async (req, res) => {
  const cls = await classService.updateClass(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Class updated successfully",
    class: cls,
  });
};

// DELETE /api/classes/:id
export const deleteClass = async (req, res) => {
  const result = await classService.deleteClass(req.params.id);
  res.status(200).json({ success: true, ...result });
};
