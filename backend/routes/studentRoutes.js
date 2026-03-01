import express from "express";
import {
  getCourses,
  getAcademicYear,
} from "../controller/StudentController.js";

const router = express.Router();

router.get("/course-list", getCourses);
router.get("/enrollment-open-status", getAcademicYear);

export default router;
