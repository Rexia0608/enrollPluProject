<<<<<<< HEAD
import { verifyingOtpModel, resendOtp } from "../services/OtpServices.js";
import { loginUserModel, registerUserModel } from "../models/usersAuthModel.js";

const UserRegisterController = async (req, res) => {
  try {
    const response = await registerUserModel(req.body);

    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
=======
import { verifyingOtpServices, resendOtp } from "../services/OtpServices.js";
import { loginUserModel, registerUserModel } from "../models/userAuthModel.js";
>>>>>>> 5c8dcd30dd49ebb5e6fa159bd13d4ea17ad7129c

const userAuthController = async (req, res) => {
  try {
    const response = (await verifyingOtpServices(req.body)) || {};

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

const UserRegisterController = async (req, res) => {
  try {
    const response = await registerUserModel(req.body);

    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
  UserRegisterController,
};
