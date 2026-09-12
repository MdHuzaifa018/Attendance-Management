import * as subjectService from "../services/subject.service.js";

/**
 * Subject controllers.
 * Express 5 async error handling forwarding to errorHandler.
 */

// GET /api/subjects?search=&classId=&teacherId=&page=1&limit=20&all=true
export const getSubjects = async (req, res) => {
  const { search, classId, teacherId, page = 1, limit = 20, all } = req.query;

  const result = await subjectService.getAllSubjects({
    search,
    classId,
    teacherId,
    page: Number(page),
    limit: Number(limit),
    all: all === "true",
  });

  res.status(200).json({ success: true, ...result });
};

// GET /api/subjects/:id
export const getSubject = async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id);
  res.status(200).json({ success: true, subject });
};

// POST /api/subjects
export const createSubject = async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    subject,
  });
};

// PUT /api/subjects/:id
export const updateSubject = async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    subject,
  });
};

// DELETE /api/subjects/:id
export const deleteSubject = async (req, res) => {
  const result = await subjectService.deleteSubject(req.params.id);
  res.status(200).json({ success: true, ...result });
};
