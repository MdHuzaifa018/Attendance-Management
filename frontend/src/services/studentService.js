import api from "./api.js";

/**
 * studentService — all API calls for student CRUD.
 * Uses the centralized Axios instance (api.js) which handles auth headers
 * and token-expiry redirects via interceptors.
 */

/**
 * @param {object} params - { search, classId, departmentId, page, limit }
 * @returns {{ students, pagination }}
 */
export const getStudents = async (params = {}) => {
  const { data } = await api.get("/students", { params });
  return data; // { success, students, pagination }
};

/**
 * @param {string} id - Student ObjectId
 */
export const getStudentById = async (id) => {
  const { data } = await api.get(`/students/${id}`);
  return data.student;
};

/**
 * @param {object} studentData - matches createStudentSchema
 */
export const createStudent = async (studentData) => {
  const { data } = await api.post("/students", studentData);
  return data.student;
};

/**
 * @param {string} id
 * @param {object} updates - matches updateStudentSchema
 */
export const updateStudent = async (id, updates) => {
  const { data } = await api.put(`/students/${id}`, updates);
  return data.student;
};

/**
 * @param {string} id
 */
export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`);
  return data;
};

// ─── Dropdown data loaders ───────────────────────────────────────────────────

/**
 * Load all active departments for the "Department" select dropdown.
 */
export const getDepartments = async () => {
  const { data } = await api.get("/departments");
  return data.departments; // [{ _id, name, code }]
};

/**
 * Load classes, optionally filtered by department.
 * Used to cascade the Class dropdown after a Department is selected.
 * @param {string} [departmentId]
 */
export const getClassesByDepartment = async (departmentId = "") => {
  const params = departmentId ? { departmentId } : {};
  const { data } = await api.get("/classes", { params });
  return data.classes; // [{ _id, name, code, department }]
};
