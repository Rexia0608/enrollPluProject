import express from "express";
import {
  userAuthController,
  userAuthResendOtpController,
  userAuthLoginController,
} from "../controller/userAuthController.js";
import OtpVaildation from "../middleware/OtpVaildation.js";
import ResendOtpVadation from "../middleware/ResendOtpVadation.js";
import loginValidation from "../middleware/LoginValidation.js";

const router = express.Router();

router.post("/verify-otp", OtpVaildation, userAuthController);
router.post("/login", loginValidation, userAuthLoginController);
router.post("/resend-otp", ResendOtpVadation, userAuthResendOtpController);

export default router;
