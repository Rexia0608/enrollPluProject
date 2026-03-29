import express from "express";
import { getReviewQueue } from "../controller/FacultyController.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//
router.get("/review-queue", getReviewQueue);

export default router;
