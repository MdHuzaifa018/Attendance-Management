import api from "./api.js";

export const applyLeave = async (leaveData) => {
  const { data } = await api.post("/leaves/apply", leaveData);
  return data.data;
};

export const getMyLeaves = async () => {
  const { data } = await api.get("/leaves/my");
  return data.data || [];
};

export const getAllLeaves = async (status = "") => {
  const { data } = await api.get("/leaves", { params: status ? { status } : {} });
  return data.data || [];
};

export const reviewLeave = async (id, status, reviewNote = "") => {
  const { data } = await api.patch(`/leaves/${id}/review`, { status, reviewNote });
  return data.data;
};
