import api from "./api.js";

/**
 * departmentService — API wrapper for Department operations.
 */

export const getDepartments = async (params = {}) => {
  const { data } = await api.get("/departments", { params });
  return data;
};

export const getDepartmentById = async (id) => {
  const { data } = await api.get(`/departments/${id}`);
  return data.department;
};

export const createDepartment = async (departmentData) => {
  const { data } = await api.post("/departments", departmentData);
  return data.department;
};

export const updateDepartment = async (id, updates) => {
  const { data } = await api.put(`/departments/${id}`, updates);
  return data.department;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/departments/${id}`);
  return data;
};
