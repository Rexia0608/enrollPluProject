import express from "express";
import { getUserList } from "../controller/AdminController.js";

const router = express.Router();

router.get("/usersList", getUserList);

export default router;
