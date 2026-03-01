import {
  getAllCoursesList,
  getAcademicYearlist,
  createEnrollment,
} from "../models/StudentModel.js";

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
      AcademicYear: result,
    });
  } catch (error) {
    console.error("Error in getAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const documentsHandler = async (req, res) => {
  try {
    // Extract enrollment data from req.body (Multer parses text fields automatically)
    const {
      studentId,
      studentType,
      contactNumber,
      address,
      yearLevel,
      course,
      academicYear,
      semester,
      fullName,
      email,
      birthDate,
      gender,
    } = req.body;

    // Validate required fields
    if (!studentId || !studentType || !course) {
      return res.status(400).json({
        message: "Missing required enrollment fields",
      });
    }

    // First: Create the enrollment record (you need to implement this)
    const enrollmentResult = await createEnrollment({
      studentId,
      studentType,
      contactNumber,
      address,
      yearLevel,
      course,
      academicYear,
      semester,
      fullName,
      email,
      birthDate,
      gender,
      status: "pending",
    });

    const enrollmentId = enrollmentResult.id;

    // Second: Save document records with file paths if files were uploaded
    let documentResult = null;
    if (req.files && Object.keys(req.files).length > 0) {
      documentResult = await documentsHandlerModel(req.files, enrollmentId);
    }

    res.status(200).json({
      message: "Enrollment submitted successfully",
      enrollmentId: enrollmentId,
      documents: documentResult,
    });
  } catch (error) {
    console.error("Error in documentsHandler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getCourses, getAcademicYear, documentsHandler };
