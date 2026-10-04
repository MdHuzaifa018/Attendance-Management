import * as academicSessionService from "../services/academicSession.service.js";

export const getSessions = async (req, res) => {
  try {
    const sessions = await academicSessionService.getSessions();
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveSession = async (req, res) => {
  try {
    const session = await academicSessionService.getActiveSession();
    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const session = await academicSessionService.createSession(req.body);
    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await academicSessionService.updateSession(req.params.id, req.body);
    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await academicSessionService.deleteSession(req.params.id);
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
