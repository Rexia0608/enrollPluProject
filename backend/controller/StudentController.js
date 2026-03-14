import {
  getAllCoursesList,
  getAcademicYearlistModel,
  enrollStudentModel,
  getMyEnrollmentModel,
  postPaymentModel,
  getEnrollmentProfileModel,
  getCheckStudentIfEnrolledModel,
} from "../models/StudentModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

// finalized here //

const getAcademicYear = async (req, res) => {
  try {
    const data = await getAcademicYearlistModel(); // Returns array

    // data is an array, not an object with .success
    const isEmpty = Array.isArray(data) && data.length === 0;

    return globalResponseHandler(res, data[0], {
      message: isEmpty
        ? "No academic years found"
        : "Academic Year loaded successfully",
      statusCode: 200, // 200 for GET success, 201 is for CREATED
      meta: { count: data.length },
    });
  } catch (error) {
    console.error("Error in getAcademicYear:", error);

    return errorResponseHandler(res, error, 500);
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

const enrollStudent = async (req, res) => {
  try {
    const result = await enrollStudentModel(req.body);

    return globalResponseHandler(res, result, {
      message: result
        ? "Enrollment process submitted"
        : "Student already enrolled for the current academic year",
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

//+++++++++++++++++++++++++++++++++++++++++++++++//

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesList();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyEnrollment = async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await getMyEnrollmentModel(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || "Failed to fetch enrollment",
      });
    }

    // If no enrollment found
    if (!result.data) {
      return res.status(404).json({
        success: true,
        message: "No enrollment found",
        data: null,
      });
    }

    // Transform the data to match frontend expectations
    const transformedData = {
      id: result.data.enrollment_id,
      status: result.data.enrollment_status, // Map to frontend status values
      studentType: result.data.student_type,
      course: result.data.course_name,
      courseCode: result.data.course_code,
      submittedAt: result.data.created_at,
      yearLevel: result.data.year_level,
      academicYear: result.data.academic_year,
      semester: result.data.semester,
      remarks: result.data.remarks,
    };

    return res.status(200).json({
      success: true,
      message: "Enrollment retrieved successfully",
      data: transformedData,
    });
  } catch (error) {
    console.error("Error in getMyEnrollment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const postPayment = async (req, res) => {
  try {
    const result = await postPaymentModel(req.params);
    res.status(200).json(result);
  } catch (error) {
    return errorResponseHandler(
      res,
      new Error(error.message || "Payment process failed"),
      400,
    );
  }
};

const getEnrollmentProfile = async (req, res) => {
  try {
    const result = await getEnrollmentProfileModel(req.params);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getCourses,
  getEnrollmentProfile,
  getAcademicYear,
  enrollStudent,
  getMyEnrollment,
  postPayment,
  getCheckStudentIfEnrolled,
};
