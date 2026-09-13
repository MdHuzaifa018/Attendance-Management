import api from "./api.js";

export const getMyMarks = async () => {
  const { data } = await api.get("/marks/my");
  return data.data || [];
};

export const getStudentMarks = async (studentId) => {
  const { data } = await api.get(`/marks/student/${studentId}`);
  return data.data || [];
};

export const recordMark = async (markData) => {
  const { data } = await api.post("/marks", markData);
  return data.data;
};
