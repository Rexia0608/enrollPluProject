import {
  insertCourseModel,
  checkIfCourseExist,
  getAllCoursesModel,
  deleteCourseModel,
} from "../models/coursesModel.js";
import { identifyUser } from "../utils/userIdentifier.js";

const addCourseController = async (req, res, next) => {
  try {
    const currentUser = req.user.formattedUser.role;

    if (currentUser !== "admin") {
      return res.status(403).json({ message: "Only admins can add courses." });
    }

    const { course_code, course_name } = req.body;

    // check if already exists
    const exists = await checkIfCourseExist({ course_code, course_name });
    if (exists) {
      return res.status(300).json({ message: "Course already exists." });
    }

    const newCourse = await insertCourseModel({ course_code, course_name });

    res.status(201).json({
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourseController = async (req, res, next) => {
  const currentUser = req.user.formattedUser.role;
  let x = identifyUser(req.user);
  try {
    const { course_id, is_active } = req.body;

    if (!course_id) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    // Default to soft delete if is_active is not provided
    const newStatus = typeof is_active === "boolean" ? is_active : false;

    const updatedCourse = await deleteCourseModel(
      course_id,
      newStatus,
      currentUser
    );

    const message = newStatus
      ? "Course has been activated."
      : "Course has been deactivated.";

    res.status(200).json({
      message,
      course: updatedCourse,
    });
  } catch (error) {
    next(error); // send to global error handler
  }
};

const getCoursesController = async (req, res, next) => {
  try {
    const courses = await getAllCoursesModel();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export { addCourseController, getCoursesController, deleteCourseController };
