import api from "./api.js";

/**
 * attendanceService — API client for daily attendance marking and sheets.
 */

export const getAssignedSubjects = async () => {
  const { data } = await api.get("/attendance/assigned-subjects");
  return data;
};

export const overrideStudentAttendance = async (overrideData) => {
  const { data } = await api.post("/attendance/bulk-override", overrideData);
  return data;
};

export const getAttendanceSheet = async (params) => {
  const { data } = await api.get("/attendance/sheet", { params });
  return data;
};

export const markAttendance = async (payload) => {
  const { data } = await api.post("/attendance/mark", payload);
  return data;
};

export const getClasses = async () => {
  const { data } = await api.get("/classes", { params: { all: true } });
  return data.classes;
};

export const getSubjectsByClass = async (classId) => {
  const { data } = await api.get("/subjects", {
    params: { classId, all: true },
  });
  return data.subjects;
};
