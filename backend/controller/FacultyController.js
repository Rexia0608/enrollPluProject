import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";
import { getReviewQueueModel } from "../models/FacultyModel.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const getReviewQueue = async (req, res) => {
  try {
    const data = await getReviewQueueModel();
    console.log(data);

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

export { getReviewQueue };
