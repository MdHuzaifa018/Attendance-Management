import api from "./api.js";

/**
 * classService — API client for Class operations.
 */

export const getClasses = async (params = {}) => {
  const { data } = await api.get("/classes", { params });
  return data;
};

export const getClassById = async (id) => {
  const { data } = await api.get(`/classes/${id}`);
  return data.class;
};

export const createClass = async (classData) => {
  const { data } = await api.post("/classes", classData);
  return data.class;
};

export const updateClass = async (id, updates) => {
  const { data } = await api.put(`/classes/${id}`, updates);
  return data.class;
};

export const deleteClass = async (id) => {
  const { data } = await api.delete(`/classes/${id}`);
  return data;
};

export const getDepartments = async () => {
  const { data } = await api.get("/departments", { params: { all: true } });
  return data.departments;
};
