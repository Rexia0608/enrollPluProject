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
  getOverViewModel,
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
  getEnrollmentTrendModel,
  getIncomeOverviewModel,
  getPaymentProgressModel,
  getEnrollmentFunnelModel,
  getTopCoursesModel,
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

const getOverView = async (req, res) => {
  try {
    const data = await getOverViewModel();

    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
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

const getEnrollmentTrend = async (req, res) => {
  try {
    const data = await getEnrollmentTrendModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getEnrollmentTrend:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getIncomeOverview = async (req, res) => {
  try {
    const data = await getIncomeOverviewModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getincomeOverview:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getPaymentProgress = async (req, res) => {
  try {
    const data = await getPaymentProgressModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getpaymentProgress:", error);
    return errorResponseHandler(res, error, 500);
  }
};

const getEnrollmentFunnel = async (req, res) => {
  try {
    const data = await getEnrollmentFunnelModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getenrollmentFunnel:", error);
    return errorResponseHandler(res, error, 500);
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here getTopCourses +++++++++++++++++++//
const getTopCourses = async (req, res) => {
  try {
    const data = await getTopCoursesModel();
    return globalResponseHandler(res, data || null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error in getenrollmentFunnel:", error);
    return errorResponseHandler(res, error, 500);
  }
};
//++++++++++++++++++ TEST here +++++++++++++++++++//

export {
  getTopCourses,
  getEnrollmentFunnel,
  getPaymentProgress,
  getIncomeOverview,
  getEnrollmentTrend,
  updatePassword,
  updateSemester,
  updateUser,
  getAllUsers,
  getCourses,
  getOverView,
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
