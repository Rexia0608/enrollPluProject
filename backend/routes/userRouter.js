import express from "express";
import UserRegisterController from "../controller/userRegisterController.js";
import ValidationHandler from "../middleware/ValidationHandler.js";

const router = express.Router();

router.post("/register", ValidationHandler, UserRegisterController);

export default router;
