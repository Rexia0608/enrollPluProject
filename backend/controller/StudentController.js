import {
  getAllCoursesList,
  getAcademicYearlist,
  createEnrollment,
  documentsHandlerModel,
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
    console.log(req.body);
  } catch (error) {
    console.error("Error in postEnrollmentProcess:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEnrollment = async (req, res) => {
  try {
    // Get student ID from authenticated user (from token/session)
    const studentId = req.user?.id || "STU-DEFAULT-001";

    // HARDCODED RESPONSES - Change these based on what you want to test
    const useScenario = "pending"; // Change this to switch scenarios

    let result;

    switch (useScenario) {
      case "pending":
        // Scenario: Student has pending enrollment
        result = {
          id: "ENR-2024-00123",
          studentId: studentId,
          studentType: "new",
          fullName: "Juan Dela Cruz",
          email: "juan.delacruz@example.com",
          contactNumber: "09123456789",
          address: "123 Mabini St., Barangay Poblacion, Makati City",
          yearLevel: "First Year",
          course: "BSCS",
          courseName: "Bachelor of Science in Computer Science",
          academicYear: "2024-2025",
          semester: "1st Semester",
          status: "pending",
          submittedAt: new Date().toISOString(),
          documents: {
            form138: "uploads/form138_sample.pdf",
            birthCertificate: "uploads/birth_cert_sample.pdf",
          },
          message: "Enrollment application found",
        };
        break;

      case "approved":
        // Scenario: Enrollment approved
        result = {
          id: "ENR-2024-00123",
          studentId: studentId,
          studentType: "new",
          fullName: "Juan Dela Cruz",
          email: "juan.delacruz@example.com",
          contactNumber: "09123456789",
          address: "123 Mabini St., Makati City",
          yearLevel: "First Year",
          course: "BSCS",
          courseName: "Bachelor of Science in Computer Science",
          academicYear: "2024-2025",
          semester: "1st Semester",
          status: "approved",
          submittedAt: "2024-06-01T10:30:00Z",
          approvedAt: new Date().toISOString(),
          message: "Enrollment application approved",
        };
        break;

      case "enrolled":
        // Scenario: Student already enrolled
        result = {
          id: "ENR-2024-00123",
          studentId: studentId,
          studentType: "old",
          fullName: "Juan Dela Cruz",
          email: "juan.delacruz@example.com",
          contactNumber: "09123456789",
          yearLevel: "Third Year",
          course: "BSCS",
          courseName: "Bachelor of Science in Computer Science",
          academicYear: "2024-2025",
          semester: "1st Semester",
          status: "enrolled",
          studentNumber: "2022-12345",
          enrolledAt: "2024-06-01T08:00:00Z",
          message: "Student is currently enrolled",
        };
        break;

      case "rejected":
        // Scenario: Enrollment rejected (can re-enroll)
        result = {
          id: "ENR-2024-00123",
          studentId: studentId,
          studentType: "new",
          fullName: "Juan Dela Cruz",
          email: "juan.delacruz@example.com",
          status: "rejected",
          submittedAt: "2024-06-01T10:30:00Z",
          rejectedAt: new Date().toISOString(),
          rejectionReason: "Incomplete documents - missing birth certificate",
          message: "Enrollment application was rejected",
        };
        break;

      case "no-enrollment":
      default:
        // Return 404 for no enrollment
        return res.status(404).json({
          success: false,
          message: "No enrollment application found",
        });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      data: result,
      message: result.message || "Enrollment retrieved successfully",
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { getCourses, getAcademicYear, enrollStudent, getEnrollment };
