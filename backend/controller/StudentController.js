import {
  getAllCoursesList,
  getAcademicYearlist,
  enrollStudentModel,
  getMyEnrollmentModel,
} from "../models/StudentModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesList();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAcademicYear = async (req, res) => {
  try {
    const result = await getAcademicYearlist();
    res.status(200).json({
      message: "Academic Year loaded successfully",
      Response: result,
    });
  } catch (error) {
    console.error("Error in getAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const result = await enrollStudentModel(req.body);

    return globalResponseHandler(res, result, {
      message: result.success ? result.message : "Enrollment failed",
      statusCode: result.success ? 201 : 400,
    });
  } catch (error) {
    return errorResponseHandler(
      res,
      new Error(error.message || "Enrollment Process failed"),
      400,
    );
  }
};

const getMyEnrollment = async (req, res) => {
  try {
    // Get userId from URL parameter
    const userId = req.params.userId;
    // OR from query string
    // const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("Fetching enrollment for user:", userId);

    const result = await getMyEnrollmentModel(userId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getMyEnrollment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getCourses, getAcademicYear, enrollStudent, getMyEnrollment };
