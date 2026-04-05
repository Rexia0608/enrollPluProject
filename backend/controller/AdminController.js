// controllers/adminController.js
import {
  getMaintenanceModel,
  getmaintenanceMessageModel,
  updateMaintenanceModel,
} from "../models/maintenanceModel.js";

import {
  globalResponseHandler,
  errorResponseHandler,
} from "../middleware/responseHandler.js";

import {
  updatePasswordModel,
  updateSemesterModel,
  updateUserModel,
  getAllUsersListModel,
  getAllCoursesModel,
  updateCoursesModel,
  postNewCoursesModel,
  deleteCoursesModel,
  updateCredentialsModel,
  updateStatusAcademicYearModel,
  postAcademicYearModel,
  getAcademicYearModel,
  updateClassStatusAcademicYearModel,
} from "../models/AdminModel.js";

//******************  NEED TO REFACTOR ***********************//
const updateCredentials = async (req, res) => {
  try {
    const data = await updateCredentialsModel(req.params.id, req.body);

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const { maintenanceMode, message } = req.body;

    const maintenance = await updateMaintenanceModel({
      isActive: maintenanceMode,
      message: message,
    });
    return globalResponseHandler(res, maintenance || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateMaintenance:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getMaintenanceMessege = async (req, res) => {
  try {
    const message = await getmaintenanceMessageModel();
    return globalResponseHandler(res, message || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in  getMaintenanceMessege:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getMaintenance = async (req, res) => {
  try {
    const { maintenanceState } = await getMaintenanceModel();

    return globalResponseHandler(res, maintenanceState || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getMaintenance:", error);
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

//++++++++++++++++++ finalized here +++++++++++++++++++//

const getAllUsers = async (req, res) => {
  try {
    const data = await getAllUsersListModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getCourses = async (req, res) => {
  try {
    const data = await getAllCoursesModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getCourses:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getAcademicYear = async (req, res) => {
  try {
    const data = await getAcademicYearModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getAcademicYear:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { data } = await updateUserModel(req.params, req.body);

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateCourses = async (req, res) => {
  try {
    await updateCoursesModel(req.params.course_id, req.body);

    return globalResponseHandler(res, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateCourses:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const postNewCourses = async (req, res) => {
  try {
    const { data } = await postNewCoursesModel(req.body);

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in postNewCourses:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { data } = await deleteCoursesModel(req.params.id);
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const postAcademicYear = async (req, res) => {
  try {
    const data = await postAcademicYearModel(req.body);

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in postAcademicYear:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateStatusAcademicYear = async (req, res) => {
  try {
    const data = await updateStatusAcademicYearModel(
      req.params.year_id,
      req.body.enrollment_open,
    );

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateStatusAcademicYear:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateClassStatusAcademicYear = async (req, res) => {
  try {
    const data = await updateClassStatusAcademicYearModel(
      req.body,
      req.params.id,
    );

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateClassStatusAcademicYear:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updateSemester = async (req, res) => {
  try {
    const data = await updateSemesterModel(req.params.id, req.body);

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updateSemester:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const updatePassword = async (req, res) => {
  try {
    const data = await updatePasswordModel(req.params.user_id);
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here  +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

export {
  updatePassword,
  updateSemester,
  updateUser,
  getAllUsers,
  getCourses,
  overView,
  getMaintenance,
  updateMaintenance,
  getMaintenanceMessege,
  postNewCourses,
  updateCourses,
  deleteCourse,
  updateCredentials,
  postAcademicYear,
  getAcademicYear,
  updateStatusAcademicYear,
  updateClassStatusAcademicYear,
};
