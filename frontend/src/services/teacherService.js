import api from "./api.js";

/**
 * teacherService — API client functions for Teacher CRUD operations.
 * Uses centralized Axios instance with JWT interceptors.
 */

/**
 * @param {object} params - { search, departmentId, page, limit }
 * @returns {{ success, teachers, pagination }}
 */
export const getTeachers = async (params = {}) => {
  const { data } = await api.get("/teachers", { params });
  return data;
};

/**
 * @param {string} id - Teacher ObjectId
 */
export const getTeacherById = async (id) => {
  const { data } = await api.get(`/teachers/${id}`);
  return data.teacher;
};

/**
 * @param {object} teacherData - payload matching createTeacherSchema
 */
export const createTeacher = async (teacherData) => {
  const { data } = await api.post("/teachers", teacherData);
  return data.teacher;
};

/**
 * @param {string} id
 * @param {object} updates - payload matching updateTeacherSchema
 */
export const updateTeacher = async (id, updates) => {
  const { data } = await api.put(`/teachers/${id}`, updates);
  return data.teacher;
};

/**
 * @param {string} id
 */
export const deleteTeacher = async (id) => {
  const { data } = await api.delete(`/teachers/${id}`);
  return data;
};

/**
 * Load active departments for dropdown.
 */
export const getDepartments = async () => {
  const { data } = await api.get("/departments");
  return data.departments;
};
