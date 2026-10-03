import AcademicSession from "../models/AcademicSession.js";

export const getSessions = async () => {
  return await AcademicSession.find().sort({ startYear: -1 }).lean();
};

export const createSession = async (data) => {
  return await AcademicSession.create(data);
};

export const updateSession = async (id, data) => {
  const session = await AcademicSession.findById(id);
  if (!session) throw new Error("Session not found");

  Object.assign(session, data);
  await session.save();
  return session;
};

export const getActiveSession = async () => {
  return await AcademicSession.findOne({ isCurrent: true }).lean();
};
