import express from "express";
import {
  getCourses,
  getAcademicYear,
  enrollStudent,
  getMyEnrollment,
  postPayment,
  getEnrollmentProfile,
  getCheckStudentIfEnrolled,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";
import uploadReceipts from "../middleware/uploadReceipts.js";

const router = express.Router();
//finalize on here //
router.get("/enrollment-open-status", getAcademicYear);
router.get("/enrollment-checking/:user_id", getCheckStudentIfEnrolled);
router.get("/course-list", getCourses);

router.post(
  "/enrollment-upload-documents-process",
  upload.fields([
    { name: "form138", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "honorableDismissal", maxCount: 1 },
    { name: "PhotoId", maxCount: 1 },
  ]),
  enrollStudent,
);

//finalize ont top //

router.get("/my-enrollment/:user_id", getMyEnrollment);

router.get("/enrollment_profile/:user_id", getEnrollmentProfile);

router.post(
  "/upload-payment-process/:userId/:enrollment_id",
  uploadReceipts.fields([{ name: "receipts", maxCount: 1 }]),
  postPayment,
);

export default router;
