import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
