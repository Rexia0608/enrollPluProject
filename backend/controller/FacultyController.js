import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";
import {
  getReviewQueueModel,
  postVerifiedDocumentModel,
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

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

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

export { getReviewQueue, postVerifiedDocument };
