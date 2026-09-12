import api from "./api.js";

/**
 * subjectService — API client for Subject operations.
 */

export const getSubjects = async (params = {}) => {
  const { data } = await api.get("/subjects", { params });
  return data;
};

export const getSubjectById = async (id) => {
  const { data } = await api.get(`/subjects/${id}`);
  return data.subject;
};

export const createSubject = async (subjectData) => {
  const { data } = await api.post("/subjects", subjectData);
  return data.subject;
};

export const updateSubject = async (id, updates) => {
  const { data } = await api.put(`/subjects/${id}`, updates);
  return data.subject;
};

export const deleteSubject = async (id) => {
  const { data } = await api.delete(`/subjects/${id}`);
  return data;
};

export const getClasses = async () => {
  const { data } = await api.get("/classes", { params: { all: true } });
  return data.classes;
};

export const getTeachers = async () => {
  const { data } = await api.get("/teachers", { params: { limit: 100 } });
  return data.teachers;
};
