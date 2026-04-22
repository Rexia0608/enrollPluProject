import express from "express";
import fetchdocument from "../middleware/fetchdocument.js";
import deleteDocument from "../middleware/deleteDocument.js";
import deleteVerifiedPayment from "../middleware/deleteVerifiedPayment.js";
import fetchdocumentPayment from "../middleware/fetchdocumentPayment.js";
import photofinder from "../middleware/photofinder.js";

import {
  getValidateReceipt,
  getReviewQueue,
  postVerifiedDocument,
  getReviewQueuePayment,
  postVerifiedPayment,
  postPromissoryFile,
  getKpiCards,
} from "../controller/FacultyController.js";

const router = express.Router();
//++++++++++++++++++ finalized here +++++++++++++++++++//
router.get("/check-receipt-intigrity/:filename", getValidateReceipt);
router.get("/queue-proof-of-payment-review", getReviewQueuePayment);
router.get("/review-proof-of-payment/:filename", fetchdocumentPayment);
router.get("/review-queue", getReviewQueue);
router.get("/review-document/:filename", fetchdocument);
router.patch("/verified-document", deleteDocument, postVerifiedDocument);
router.patch("/verified-payment", deleteVerifiedPayment, postVerifiedPayment);
router.patch("/handle-excuse-letter", postPromissoryFile);
//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//
router.get("/kpiCards", getKpiCards);
router.get("/get-images/:file", photofinder);

export default router;
