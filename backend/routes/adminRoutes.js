import express from "express";
import {
  getAllUsers,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
} from "../controller/AdminController.js";
import { setAnnouncement, getStats } from "../services/announcementServices.js";

const router = express.Router();

router.get("/usersList", getAllUsers);
router.get("/courseList", getCourseList);
router.get("/overView", overView);
router.get("/maintenance", checkMaintenance);
router.get("/stats", getStats);
router.get("/maintenance-messege", getMaintenanceMessege);

router.put("/maintenance", setMaintenance);

router.post("/announcement", setAnnouncement);

export default router;
