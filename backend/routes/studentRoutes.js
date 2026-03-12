import express from "express";
import {
  getCourses,
  getAcademicYear,
  enrollStudent,
  getMyEnrollment,
  postPayment,
  getEnrollmentProfile,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";
import uploadReceipts from "../middleware/uploadReceipts.js";

const router = express.Router();
router.get("/course-list", getCourses);
router.get("/my-enrollment/:id", getMyEnrollment);
router.get("/enrollment-open-status", getAcademicYear);
router.get("/enrollment_profile/:user_id", getEnrollmentProfile);

router.post(
  "/upload-payment-process/:userId/:enrollment_id",
  uploadReceipts.fields([{ name: "receipts", maxCount: 1 }]),
  postPayment,
);

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
