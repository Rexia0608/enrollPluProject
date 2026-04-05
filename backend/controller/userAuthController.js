import {
  resendOtpModel,
  loginUserModel,
  verifyingOtpModel,
  registerUserModel,
  checkIfTheUserExist,
  userAuthPasswordModel,
  userAuthSetPasswordModel,
} from "../models/UsersAuthModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

const UserRegisterController = async (req, res) => {
  try {
    const data = await registerUserModel(req.body);

    if (data.error) {
      return errorResponseHandler(
        res,
        new Error(
          data.error ||
            "Email is already in use. Please try to login using your credentials.",
        ),
        400,
      );
    }

    return globalResponseHandler(res, data, {
      message: `Registration successful.`,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const userAuthSetPasswordController = async (req, res) => {
  try {
    const updatedData = await userAuthSetPasswordModel(
      req.params.token,
      req.body[0],
    );

    return globalResponseHandler(res, true, {
      message: `User ${updatedData} password updated successfully`,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const userAuthPasswordController = async (req, res) => {
  try {
    const data = await userAuthPasswordModel(req.params.token);
    return globalResponseHandler(res, data, {
      message: "User registered successfully",
      statusCode: 201,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const userAuthDetailCotnroller = async (req, res) => {
  try {
    const data = await checkIfTheUserExist(req.body.email);

    return globalResponseHandler(res, data, {
      message: `User ${updatedData} password updated successfully`,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const userAuthController = async (req, res) => {
  try {
    const data = (await verifyingOtpModel(req.body)) || {};

    if (data.error) {
      return errorResponseHandler(
        res,
        new Error(data.error || "Verification failed"),
        400,
      );
    }

    return globalResponseHandler(res, data, {
      message: `Email verified successfully!`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const userAuthResendOtpController = async (req, res) => {
  try {
    const data = (await resendOtpModel(req.body)) || {};

    if (data.error) {
      return errorResponseHandler(
        res,
        new Error(data.error || "Verification failed"),
        400,
      );
    }

    return globalResponseHandler(res, data, {
      message: `OTP sent successfully to ${data}!`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

/*************************test **************************************/

/*************************test **************************************/

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
  userAuthSetPasswordController,
  userAuthPasswordController,
  userAuthDetailCotnroller,
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
  UserRegisterController,
};
