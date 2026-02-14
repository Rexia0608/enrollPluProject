import express from "express";
import {
  getUserList,
  getCourseList,
  overView,
} from "../controller/AdminController.js";

const router = express.Router();

router.get("/usersList", getUserList);
router.get("/courseList", getCourseList);
router.get("/overView", overView);

export default router;
