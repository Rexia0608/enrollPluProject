import { registerUserModel } from "../models/usersModel.js";

const UserRegisterController = async (req, res) => {
  try {
    const result = await registerUserModel(req.body);

    if (result === "Email is already in used.") {
      console.log(result);
      return res.status(200).json({ result });
    }
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};

export default UserRegisterController;
