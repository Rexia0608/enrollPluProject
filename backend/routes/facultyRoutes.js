import express from "express";
import fetchdocument from "../middleware/fetchdocument.js";
import { getReviewQueue } from "../controller/FacultyController.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/review-queue", getReviewQueue);
//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

// http://localhost:3000/faculty/review-document/c069768b-e7a6-4f46-9d64-1af0263a634b-birthCertificate.jpg
router.get("/review-document/:filename", fetchdocument);
export default router;
