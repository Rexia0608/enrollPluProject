import { verifyingOtpServices, resendOtp } from "../services/OtpServices.js";
import {
  loginUserModel,
  registerUserModel,
  checkIfTheUserExist,
} from "../models/UsersAuthModel.js";
import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

const UserRegisterController = async (req, res) => {
  try {
    const result = await registerUserModel(req.body);

    if (result.error) {
      return errorResponseHandler(res, new Error(result.error), 400);
    }

    return globalResponseHandler(res, result, {
      message: "User registered successfully",
      statusCode: 201,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const userAuthController = async (req, res) => {
  try {
    const result = (await verifyingOtpServices(req.body)) || {};

    if (result.error) {
      return errorResponseHandler(
        res,
        new Error(result.error || "Verification failed"),
        400,
      );
    }

    return globalResponseHandler(res, result, {
      message: result.message || "OTP verified successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
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

const userAuthDetailCotnroller = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await checkIfTheUserExist(email);
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
  userAuthDetailCotnroller,
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
  UserRegisterController,
};
