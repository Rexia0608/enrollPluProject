// controllers/adminController.js
import {
  maintenanceCheckerModel,
  maintenanceMessageModel,
  maintenanceModel,
} from "../models/maintenanceModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

import {
  getAllUsersListModel,
  getAllCoursesListModel,
  updateCourses,
  addNewCourses,
  deleteCourses,
  switchStatusMode,
  switchStatusAcademicYear,
  addAcademicYear,
  getAcademicYearlist,
  switchClassStatusAcademicYear,
} from "../models/AdminModel.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

const getAllUsers = async (req, res) => {
  try {
    const data = await getAllUsersListModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getUserList:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesListModel();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUserList:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const setMaintenance = async (req, res) => {
  try {
    const { maintenanceMode, message } = req.body;

    const maintenance = await maintenanceModel({
      isActive: maintenanceMode,
      message: message,
    });

    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error in setMaintenance:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ TEST here +++++++++++++++++++//

const checkMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceCheckerModel();
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error in checkMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMaintenanceMessege = async (req, res) => {
  try {
    const message = await maintenanceMessageModel();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in checkMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editCourses = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const result = await updateCourses(id, data);

    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error in editCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addNewCourse = async (req, res) => {
  try {
    const result = await addNewCourses(req.body);

    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "New Course added successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error in addNewCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await deleteCourses(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error in editCourses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const switchStatus = async (req, res) => {
  try {
    const result = await switchStatusMode(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      course: result,
    });
  } catch (error) {
    console.error("Error in switchStatus:", error);
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

const setAcademicYear = async (req, res) => {
  try {
    const result = await addAcademicYear(req.body);

    if (!result) {
      return res.status(404).json({ message: "Academic Year not added" });
    }

    res.status(200).json({
      message: "New Academic Year added successfully",
      AcademicYear: result,
    });
  } catch (error) {
    console.error("Error in setAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setStatusAcademicYear = async (req, res) => {
  try {
    const result = await switchStatusAcademicYear(req.body, req.params.id);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Academic Year are fail to updated" });
    }

    res.status(200).json({
      message: "Academic Year updated status successfully",
      AcademicYear: result,
    });
  } catch (error) {
    console.error("Error in setStatusAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setClassStatusAcademicYear = async (req, res) => {
  try {
    const result = await switchClassStatusAcademicYear(req.body, req.params.id);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Academic Year are fail to updated" });
    }

    res.status(200).json({
      message: "Academic Year updated status successfully",
      AcademicYear: result,
    });
  } catch (error) {
    console.error("Error in setStatusAcademicYear:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const overView = async (req, res) => {
  try {
    const systemOverview = [
      {
        title: "Total Students",
        value: "1,248",
        change: 12,
        icon: "Users",
        color: "blue",
      },
      {
        title: "Pending Documents",
        value: "42",
        change: -5,
        icon: "FileText",
        color: "yellow",
      },
      {
        title: "Pending Payments",
        value: "28",
        change: 8,
        icon: "CreditCard",
        color: "red",
      },
      {
        title: "Enrolled Students",
        value: "876",
        change: 15,
        icon: "CheckCircle",
        color: "green",
      },
    ];
    res.status(200).json(systemOverview);
  } catch (error) {
    console.error("Error in overView:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllUsers,
  getCourses,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
  addNewCourse,
  editCourses,
  deleteCourse,
  switchStatus,
  setAcademicYear,
  getAcademicYear,
  setStatusAcademicYear,
  setClassStatusAcademicYear,
};
