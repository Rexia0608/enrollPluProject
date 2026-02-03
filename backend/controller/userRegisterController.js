import { registerUserModel } from "../models/usersModel.js";

const UserRegisterController = async (req, res) => {
  try {
    const response = await registerUserModel(req.body);

    if (response.error) {
      console.log(response.error);
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

export default UserRegisterController;
