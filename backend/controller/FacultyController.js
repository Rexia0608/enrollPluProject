import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";
import {
  getValidateReceiptModel,
  getReviewQueueModel,
  postVerifiedDocumentModel,
  getReviewQueuePaymentModel,
  postVerifiedPaymentModel,
} from "../models/FacultyModel.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//
const getReviewQueue = async (req, res) => {
  try {
    const data = await getReviewQueueModel();

    return globalResponseHandler(res, data, {
      message: data ? "Workload successfully fetch." : "No pending to review.",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getReviewQueue:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const postVerifiedDocument = async (req, res) => {
  try {
    const data = await postVerifiedDocumentModel(req.body);

    return globalResponseHandler(res, data, {
      message: data
        ? `Enrollment ID: ${req.params.fileNumber} are successssfully verified`
        : `Enrollment ID ${req.params.fileNumber} are not successssfully verified`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getReviewQueue:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getReviewQueuePayment = async (req, res) => {
  try {
    const data = await getReviewQueuePaymentModel();

    return globalResponseHandler(res, data, {
      message: data ? "Workload successfully fetch." : "No pending to review.",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getReviewQueue:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const postVerifiedPayment = async (req, res) => {
  try {
    const data = await postVerifiedPaymentModel(req.body);

    return globalResponseHandler(res, data, {
      message: data
        ? `${req.body.period} payment validated.`
        : `${req.body.period} payment rejected`,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in postVerifiedPayment:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getValidateReceipt = async (req, res) => {
  try {
    const data = await getValidateReceiptModel(req.params.filename);

    return globalResponseHandler(res, data, {
      message: data ? "Receipt successfully fetch." : "No reciept result.",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in  getValidateReceipt:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here  +++++++++++++++++++//

export {
  getValidateReceipt,
  getReviewQueue,
  postVerifiedDocument,
  getReviewQueuePayment,
  postVerifiedPayment,
};
