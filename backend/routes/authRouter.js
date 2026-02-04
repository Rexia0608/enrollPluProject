import express from "express";
import userAuthController from "../controller/userAuthController.js";
import OtpVaildation from "../middleware/OtpVaildation.js";

const router = express.Router();

router.post("/verify-otp", OtpVaildation, userAuthController);

export default router;
