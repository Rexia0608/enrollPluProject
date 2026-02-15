import express from "express";
import {
  getUserList,
  getCourseList,
  overView,
  getMaintenance,
} from "../controller/AdminController.js";

const router = express.Router();

router.get("/usersList", getUserList);
router.get("/courseList", getCourseList);
router.get("/overView", overView);
router.get("/maintenance", getMaintenance);

export default router;
