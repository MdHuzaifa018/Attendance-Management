import * as studentRequestService from "../services/studentRequest.service.js";

export const getRequests = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await studentRequestService.getAllRequests({
      status,
      search,
      page,
      limit,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPendingCount = async (req, res, next) => {
  try {
    const count = await studentRequestService.getPendingCount();
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const result = await studentRequestService.approveRequest(
      req.params.id,
      req.user._id
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await studentRequestService.rejectRequest(
      req.params.id,
      reason,
      req.user._id
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
