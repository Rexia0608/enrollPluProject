import { verifyingOtpModel } from "../models/verifyingOtpModel.js";

const userAuthController = async (req, res) => {
  try {
    const response = (await verifyingOtpModel(req.body)) || {}; // ✅ fallback to empty object

    if (response.error) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    // Success
    console.log(response.message);
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

export default userAuthController;
