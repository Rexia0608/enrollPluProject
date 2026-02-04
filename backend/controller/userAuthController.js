import { verifyingOtpModel } from "../models/verifyingOtpModel.js";

const userAuthController = async (req, res) => {
  try {
    const response = await verifyingOtpModel(req.body);
    if (response.error) {
      return res.status(400).json({ error: response.error });
    }

    // Success
    console.log(response.message);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default userAuthController;
