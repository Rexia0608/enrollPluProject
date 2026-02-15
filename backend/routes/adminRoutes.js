import express from "express";
import {
  getUserList,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
} from "../controller/AdminController.js";

const router = express.Router();

router.get("/usersList", getUserList);
router.get("/courseList", getCourseList);
router.get("/overView", overView);
router.get("/maintenance", checkMaintenance);

router.put("/maintenance", setMaintenance);

export default router;
