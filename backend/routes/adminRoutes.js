import express from "express";
import {
  getMaintenanceMessege,
  deleteCourse,
} from "../controller/AdminController.js";

import { setAnnouncement, getStats } from "../services/announcementServices.js";

import {
  updateClassStatusAcademicYear,
  updateStatusAcademicYear,
  postAcademicYear,
  updateCredentials,
  updateMaintenance,
  getMaintenance,
  updateCourses,
  updateUser,
  getAllUsers,
  getCourses,
  getAcademicYear,
  postNewCourses,
  updateSemester,
  updatePassword,
  getOverView,
} from "../controller/AdminController.js";

const router = express.Router();
//******************  NEED TO REFACTOR ***********************//
router.get("/maintenance", getMaintenance);
router.put("/maintenance", updateMaintenance);
router.get("/maintenance-messege", getMaintenanceMessege);

router.get("/stats", getStats);
router.post("/announcement", setAnnouncement);
//******************  NEED TO REFACTOR ***********************//

//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/usersList", getAllUsers);
router.get("/overView", getOverView);
router.get("/courseList", getCourses);
router.get("/academicYear", getAcademicYear);

router.post("/addCourse", postNewCourses);
router.post("/addAcademicYear", postAcademicYear);

router.patch("/password-reset/:user_id", updatePassword);
router.patch("/updateSemesterYear/:year_id", updateSemester);
router.patch("/resetPassword/:user_id", updateCredentials);
router.patch("/switchStatusAcademicYear/:year_id", updateStatusAcademicYear);
router.patch(
  "/switchClassStatusAcademicYear/:id",
  updateClassStatusAcademicYear,
);

router.put("/updateUser/:user_id", updateUser);
router.put("/editCourse/:course_id", updateCourses);

router.delete("/deleteCourse/:id", deleteCourse);

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ test here +++++++++++++++++++//

//++++++++++++++++++ test here +++++++++++++++++++//

//****************** for pending here ************************//

export default router;
