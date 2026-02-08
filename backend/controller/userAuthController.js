import { verifyingOtpModel, resendOtp } from "../models/OtpModel.js";
import { loginUserModel } from "../models/usersModel.js";

const userAuthController = async (req, res) => {
  try {
    const response = (await verifyingOtpModel(req.body)) || {};

    if (response.error) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: response.message,
      email: response.email,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const userAuthResendOtpController = async (req, res) => {
  try {
    const response = (await resendOtp(req.body)) || {};

    if (response.error) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: response.message,
      email: response.email,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const userAuthLoginController = async (req, res) => {
  try {
    const response = await loginUserModel(req.body);
    if (response.error) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
};
