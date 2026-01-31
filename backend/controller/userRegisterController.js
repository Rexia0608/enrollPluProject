import globalHandler from "../utils/GlobalErrorHandler.js";
import { registerUserModel } from "../models/usersModel.js";

const UserRegisterController = async (req, res) => {
  try {
    const { fName, lName, birthDate, gender, email, mNumber, password } =
      req.body;
    const data = { fName, lName, birthDate, gender, email, mNumber, password };
    const test = await registerUserModel(data);
    if (test) {
      return res.status(200).json(test);
    } else {
      return res.status(400).json(test);
    }
  } catch (error) {
    globalHandler(error);
  }
};

export default UserRegisterController;
