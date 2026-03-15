import express from "express";
import {
  getCourses,
  getAcademicYear,
  postEnrollStudent,
  getCheckStudentIfEnrolled,
} from "../controller/StudentController.js";
import upload from "../middleware/uploadmiddleware.js";
import uploadReceipts from "../middleware/uploadReceipts.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/course-list", getCourses);
router.get("/enrollment-open-status", getAcademicYear);
router.get("/validate-enrolled-student/:user_id", getCheckStudentIfEnrolled);

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

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

export default router;
