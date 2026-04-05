import {
  postPaymentModel,
  getAllCoursesListModel,
  postEnrollStudentModel,
  getAcademicYearlistModel,
  getCheckStudentPaymentModel,
  getCheckStudentIfEnrolledModel,
} from "../models/StudentModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

const getAcademicYear = async (req, res) => {
  try {
    const data = await getAcademicYearlistModel();

    // data is an array, not an object with .success
    const isEmpty = Array.isArray(data) && data.length === 0;

    return globalResponseHandler(res, data[0], {
      message: isEmpty
        ? "No academic years found"
        : "Academic Year loaded successfully",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getAcademicYear:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesListModel();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCheckStudentIfEnrolled = async (req, res) => {
  try {
    const data = await getCheckStudentIfEnrolledModel(req.params.user_id);

    const isEmpty = data.length === 0;

    return globalResponseHandler(res, data[0] || null, {
      message: isEmpty
        ? "Student not enrolled yet for this semester year."
        : "Student enrolled for this semester year.",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getCheckStudentIfEnrolled:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getCheckStudentPayment = async (req, res) => {
  try {
    const data = await getCheckStudentPaymentModel(req.params);

    const isEmpty = data.length === 0;

    return globalResponseHandler(res, data || null, {
      message: isEmpty
        ? "Student not enrolled yet for this semester year."
        : "Student enrolled for this semester year.",
      statusCode: 200,
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getCheckStudentIfEnrolled:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const postEnrollStudent = async (req, res) => {
  try {
    const result = await postEnrollStudentModel(req.body);

    return globalResponseHandler(res, result, {
      message: result
        ? "Enrollment process submitted"
        : "Student already enrolled for the current academic year.",
      statusCode: result ? 201 : 400,
    });
  } catch (error) {
    return errorResponseHandler(
      res,
      new Error(error.message || "Enrollment Process failed"),
      400,
    );
  }
};

const postPayment = async (req, res) => {
  try {
    const response = await postPaymentModel(req.body);
    return globalResponseHandler(res, response, {
      message: response.next_steps.message,
      statusCode: 201,
    });
  } catch (error) {
    return errorResponseHandler(
      res,
      new Error(error.message || "Payment process failed"),
      400,
    );
  }
};

//+++++++++++++++++++ finalized here +++++++++++++++++++++//

export {
  getCourses,
  postPayment,
  getAcademicYear,
  postEnrollStudent,
  getCheckStudentPayment,
  getCheckStudentIfEnrolled,
};
