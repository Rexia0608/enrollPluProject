import express from "express";
import {
  getAllUsers,
  getCourses,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
} from "../controller/AdminController.js";
import { setAnnouncement, getStats } from "../services/announcementServices.js";

const router = express.Router();

router.get("/usersList", getAllUsers);
router.get("/courseList", getCourses);
router.get("/overView", overView);
router.get("/maintenance", checkMaintenance);
router.get("/stats", getStats);
router.get("/maintenance-messege", getMaintenanceMessege);

router.put("/maintenance", setMaintenance);

router.post("/announcement", setAnnouncement);

export default router;
