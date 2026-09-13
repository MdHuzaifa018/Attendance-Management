import api from "./api.js";

export const getTimetable = async (classId, dayOfWeek = "") => {
  const params = {};
  if (classId) params.classId = classId;
  if (dayOfWeek) params.dayOfWeek = dayOfWeek;
  const { data } = await api.get("/timetable", { params });
  return data.data || [];
};

export const saveTimetable = async (timetableData) => {
  const { data } = await api.post("/timetable", timetableData);
  return data.data;
};
