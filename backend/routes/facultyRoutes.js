import express from "express";
import fetchdocument from "../middleware/fetchdocument.js";
import deleteDocument from "../middleware/deleteDocument.js";
import {
  getReviewQueue,
  postVerifiedDocument,
} from "../controller/FacultyController.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/review-queue", getReviewQueue);
router.get("/review-document/:filename", fetchdocument);
//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

router.post("/verified-document", deleteDocument, postVerifiedDocument);

export default router;
