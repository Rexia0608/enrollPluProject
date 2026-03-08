import express from "express";
import {
  getCourses,
  getAcademicYear,
  enrollStudent,
  getMyEnrollment,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";

const router = express.Router();
router.get("/my-enrollment/:id", getMyEnrollment);
router.get("/course-list", getCourses);
router.get("/enrollment-open-status", getAcademicYear);

router.post(
  "/upload-documents-process",
  upload.fields([
    { name: "form138", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "honorableDismissal", maxCount: 1 },
    { name: "PhotoId", maxCount: 1 },
  ]),
  enrollStudent,
);

export default router;
