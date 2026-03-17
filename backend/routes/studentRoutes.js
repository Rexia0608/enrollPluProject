import express from "express";
import {
  getCourses,
  postPayment,
  getAcademicYear,
  postEnrollStudent,
  getCheckStudentPayment,
  getCheckStudentIfEnrolled,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";
import uploadReceipts from "../middleware/uploadReceipts.js";
import parseJsonFields from "../middleware/parseJsonFields.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/course-list", getCourses);
router.get("/enrollment-open-status", getAcademicYear);
router.get("/validate-enrolled-student/:user_id", getCheckStudentIfEnrolled);
router.get("/validate-current-payment/:enrollment_id", getCheckStudentPayment);

router.post(
  "/enrollment-upload-documents-process",
  upload.fields([
    { name: "form138", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "honorableDismissal", maxCount: 1 },
    { name: "PhotoId", maxCount: 1 },
  ]),
  postEnrollStudent,
);

router.post(
  "/enrollment-payment-upload-process",
  uploadReceipts.fields([{ name: "proofOfPayment", maxCount: 1 }]),
  parseJsonFields,
  postPayment,
);

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

export default router;
