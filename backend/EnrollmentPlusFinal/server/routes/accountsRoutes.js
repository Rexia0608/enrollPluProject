import express from "express";
import validationRequest from "../middlewares/validationRequest.js";
import authorization from "../middlewares/authorization.js";
import {
  registerController,
  loginController,
  changePasswordController,
  userfinderController,
} from "../controllers/accountsController.js";

const router = express.Router();

router.post("/user-register", validationRequest, registerController);

router.post("/user-login", validationRequest, loginController);

router.post(
  "/user-change-password",
  validationRequest,
  changePasswordController
);

router.get("/authenticated", authorization, userfinderController);

export default router;
