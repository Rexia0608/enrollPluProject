import {
  getAllCoursesList,
  getAcademicYearlist,
  enrollStudentModel,
  getMyEnrollmentModel,
  postPaymentModel,
  getEnrollmentProfileModel,
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
    const userId = req.params.id;

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
};
