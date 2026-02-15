import express from "express";
import {
  getUserList,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
} from "../controller/AdminController.js";
import { setAnnouncement, getStats } from "../services/announcementServices.js";

const router = express.Router();

router.get("/usersList", getUserList);
router.get("/courseList", getCourseList);
router.get("/overView", overView);
router.get("/maintenance", checkMaintenance);
router.get("/stats", getStats);

router.put("/maintenance", setMaintenance);

router.post("/announcement", setAnnouncement);

export default router;
