import * as departmentService from "../services/department.service.js";

/**
 * Department controllers.
 * Express 5 forwards async rejections automatically to errorHandler middleware.
 */

// GET /api/departments?search=&page=1&limit=20&all=true
export const getDepartments = async (req, res) => {
  const { search, page = 1, limit = 20, all } = req.query;

  const result = await departmentService.getAllDepartments({
    search,
    page: Number(page),
    limit: Number(limit),
    all: all === "true",
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/departments/:id
export const getDepartment = async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);
  res.status(200).json({ success: true, department });
};

// POST /api/departments
export const createDepartment = async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  res.status(201).json({
    success: true,
    message: "Department created successfully",
    department,
  });
};

// PUT /api/departments/:id
export const updateDepartment = async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Department updated successfully",
    department,
  });
};

// DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
  const result = await departmentService.deleteDepartment(req.params.id);
  res.status(200).json({ success: true, ...result });
};
