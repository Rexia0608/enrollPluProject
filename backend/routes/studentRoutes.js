import express from "express";
import {
  getCourses,
  getAcademicYear,
  postEnrollmentProcess,
  getEnrollment,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();
router.get("/my-enrollment", getEnrollment);
router.get("/course-list", getCourses);
router.get("/enrollment-open-status", getAcademicYear);

router.post(
  "/enrollment-process",
  upload.fields([
    { name: "form138", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "honorableDismissal", maxCount: 1 },
  ]),
  postEnrollmentProcess,
);

export default router;
