import api from "./api.js";

export const getNotices = async () => {
  const { data } = await api.get("/notices");
  return data.data || [];
};

export const createNotice = async (noticeData) => {
  const { data } = await api.post("/notices", noticeData);
  return data.data;
};

export const deleteNotice = async (id) => {
  const { data } = await api.delete(`/notices/${id}`);
  return data;
};
