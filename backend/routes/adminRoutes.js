import express from "express";
import {
  getAllUsers,
  getCourses,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
  addNewCourse,
  editCourses,
  deleteCourse,
  switchStatus,
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
router.put("/editCourse/:id", editCourses);

router.post("/addCourse", addNewCourse);
router.post("/announcement", setAnnouncement);

router.delete("/deleteCourse/:id", deleteCourse);

router.patch("/switchStatus/:id", switchStatus);

export default router;
