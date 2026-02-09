import {
  accountRegisterModel,
  accountLoginModel,
  accountChangePasswordModel,
  getUserByEmailModel,
} from "../models/accountsUserModel.js";
import formatUser from "../helpers/formatUser.js";
import jwtGenerator from "../utils/jwtGenerator.js";

// ---------------- REGISTER ----------------
const registerController = async (req, res, next) => {
  try {
    const newUser = await accountRegisterModel(req.body);
    const token = jwtGenerator(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Login ----------------
const loginController = async (req, res, next) => {
  try {
    // must await your model function
    const userdata = await accountLoginModel(req.body);
    const token = jwtGenerator(userdata);
    // respond to client
    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- change password ----------------
const changePasswordController = async (req, res, next) => {
  try {
    const userdata = req.user;
    const passData = {
      email: userdata.formattedUser.email,
      password: req.body.new_password,
    };
    const result = await accountChangePasswordModel(passData);
    const formattedUser = formatUser(result);
    res.status(200).json({
      message: `User ${formattedUser.firstName} you successfully changed password`,
      formattedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- userfinder ----------------
const userfinderController = async (req, res, next) => {
  try {
    const result = await getUserByEmailModel(req.user.email);
    const formattedUser = formatUser(result);
    console.log(formattedUser);
    res.status(200).json({
      message: `User ${formattedUser.firstName} you successfully changed password`,
      formattedUser,
    });
  } catch (error) {
    next(error);
  }
};

export {
  registerController,
  loginController,
  changePasswordController,
  userfinderController,
};
