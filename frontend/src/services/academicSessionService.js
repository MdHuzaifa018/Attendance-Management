import api from "./api.js";

export const getAcademicSessions = async () => {
  const { data } = await api.get("/academic-sessions");
  return data.sessions;
};

export const getActiveSession = async () => {
  const { data } = await api.get("/academic-sessions/active");
  return data.session;
};

export const createSession = async (sessionData) => {
  const { data } = await api.post("/academic-sessions", sessionData);
  return data.session;
};

export const updateSession = async (id, sessionData) => {
  const { data } = await api.put(`/academic-sessions/${id}`, sessionData);
  return data.session;
};

export const deleteSession = async (id) => {
  const { data } = await api.delete(`/academic-sessions/${id}`);
  return data;
};
