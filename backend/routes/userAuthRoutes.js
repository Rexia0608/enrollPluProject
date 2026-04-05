import express from "express";
import {
  userAuthController,
  userAuthPasswordController,
  userAuthResendOtpController,
  userAuthLoginController,
  UserRegisterController,
  userAuthDetailCotnroller,
  userAuthSetPasswordController,
} from "../controller/UserAuthController.js";
import OtpVaildation from "../middleware/OtpVaildation.js";
import ResendOtpVadation from "../middleware/ResendOtpVadation.js";
import loginValidation from "../middleware/LoginValidation.js";
import ValidationHandler from "../middleware/ValidationHandler.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/verify-reset-token/:token", userAuthPasswordController);
router.get("/user-detail", userAuthDetailCotnroller);

router.put("/set-new-password/:token", userAuthSetPasswordController);
//++++++++++++++++++ finalized here +++++++++++++++++++//

router.post("/register", ValidationHandler, UserRegisterController);
router.post("/verify-otp", OtpVaildation, userAuthController);
router.post("/login", loginValidation, userAuthLoginController);
router.post("/resend-otp", ResendOtpVadation, userAuthResendOtpController);

/*************************test **************************************/

/*************************test **************************************/

export default router;
