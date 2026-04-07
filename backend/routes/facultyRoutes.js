import express from "express";
import fetchdocument from "../middleware/fetchdocument.js";
import deleteDocument from "../middleware/deleteDocument.js";
import deleteVerifiedPayment from "../middleware/deleteVerifiedPayment.js";
import fetchdocumentPayment from "../middleware/fetchdocumentPayment.js";

import {
  getReviewQueue,
  postVerifiedDocument,
  getReviewQueuePayment,
  postVerifiedPayment,
} from "../controller/FacultyController.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/queue-proof-of-payment-review", getReviewQueuePayment);
router.get("/review-proof-of-payment/:filename", fetchdocumentPayment);
router.get("/review-queue", getReviewQueue);
router.get("/review-document/:filename", fetchdocument);
router.patch("/verified-document", deleteDocument, postVerifiedDocument);
//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here 5DSLSY +++++++++++++++++++//

router.patch("/verified-payment", deleteVerifiedPayment, postVerifiedPayment);

export default router;
