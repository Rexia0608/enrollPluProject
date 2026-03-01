import {
  getAllCoursesList,
  getAcademicYearlist,
} from "../models/StudentModel.js";

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesList();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUserList:", error);
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
    console.error("Error in setAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getCourses, getAcademicYear };
