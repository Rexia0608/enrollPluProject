import express from "express";
import {
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
  UserRegisterController,
} from "../controller/userAuthController.js";
import ValidationHandler from "../middleware/ValidationHandler.js";
import OtpVaildation from "../middleware/OtpVaildation.js";
import ResendOtpVadation from "../middleware/ResendOtpVadation.js";
import loginValidation from "../middleware/LoginValidation.js";
import ValidationHandler from "../middleware/ValidationHandler.js";

const router = express.Router();

router.post("/register", ValidationHandler, UserRegisterController);
router.post("/verify-otp", OtpVaildation, userAuthController);
router.post("/login", loginValidation, userAuthLoginController);
router.post("/resend-otp", ResendOtpVadation, userAuthResendOtpController);

export default router;
