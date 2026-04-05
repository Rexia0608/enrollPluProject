import db from "../config/db.js";

import {
  updateClassCloseStatusAcademicYearServices,
  updateClassStatusAcademicYearServices,
  AcademicYearExistingServices,
  updateStatusCloseAllAcademicYearServices,
  updateStatusAcademicYearServices,
  postAcademicYearModelServices,
  updateCredentialsServices,
  deleteCoursesServices,
  getAcademicServices,
  updateUserServices,
  getAllUsersListServices,
  updateCoursesServices,
  getAllCoursesListServices,
  postNewCoursesServices,
  updateSemesterServices,
  updatePasswordServices,
  findUserQueryServices,
} from "../services/adminServices.js";

//++++++++++++++++++ need to refactor +++++++++++++++++++//

const updateCredentialsModel = async (id, passData) => {
  try {
    const { query, values } = updateCredentialsServices(id, passData);
    const data = await db.query(query, values);

    return data.rows[0];
  } catch (error) {
    console.error("Error in switchStatusMode:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

const postAcademicYearModel = async (passData) => {
  try {
    const { queryrExisting, valuesrExisting } =
      AcademicYearExistingServices(passData);
    const existing = await db.query(queryrExisting, valuesrExisting);

    if (existing.rows.length > 0) {
      throw new Error("Academic year and semester already exists.");
    }

    const { query, values } = postAcademicYearModelServices(passData);
    // Insert new academic year
    const data = await db.query(query, values);

    return data.rows[0];
  } catch (error) {
    console.error("Error in addAcademicYear:", error);
    throw error;
  }
};

const getAllUsersListModel = async () => {
  try {
    const { query } = getAllUsersListServices();
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllUsersList:", error);
    throw error;
  }
};

const getAllCoursesModel = async () => {
  try {
    const { query } = getAllCoursesListServices();
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    throw error;
  }
};

const updateCoursesModel = async (id, data) => {
  try {
    const { query, values } = updateCoursesServices(id, data);

    const result = await db.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateCourses:", error);
    throw error;
  }
};

const getAcademicYearModel = async () => {
  try {
    const { query } = getAcademicServices();
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getAcademicYearlist:", error);
    throw error;
  }
};

const updateUserModel = async (id, passData) => {
  try {
    const { query, values } = updateUserServices(id, passData);
    const data = await db.query(query, values);
    return data.rows[0];
  } catch (error) {
    console.error("Error in UpdateUserModel:", error);
    throw error;
  }
};

const postNewCoursesModel = async (passData) => {
  try {
    const { query, values } = postNewCoursesServices(passData);
    const data = await db.query(query, values);
    return data.rows[0];
  } catch (error) {
    console.error("Error in postNewCourses:", error);
    throw error;
  }
};

const deleteCoursesModel = async (id) => {
  try {
    const { query, values } = deleteCoursesServices(id);
    const data = await db.query(query, values);
    return data.rows[0];
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    throw error;
  }
};

const updateStatusAcademicYearModel = async (id, passData) => {
  try {
    // If opening enrollment, close all others first (only one can be open)
    if (passData === true) {
      const { query, values } = updateStatusCloseAllAcademicYearServices(id);
      await db.query(query, values);
    }

    const { query, values } = updateStatusAcademicYearServices(passData, id);

    const data = await db.query(query, values);
    if (data.rows.length === 0) throw new Error("Academic year not found");

    return data.rows[0];
  } catch (error) {
    console.error("Error in switchStatusAcademicYear:", error);
    throw error;
  }
};

const updateClassStatusAcademicYearModel = async (passData, id) => {
  try {
    // If CLASS, close all others first (only one can be open)
    if (passData.is_class_ongoing === true) {
      const { query, values } = updateClassCloseStatusAcademicYearServices(id);
      await db.query(query, values);
    }

    const { queryClose, valuesClose } = updateClassStatusAcademicYearServices(
      passData.is_class_ongoing,
      id,
    );

    const data = await db.query(queryClose, valuesClose);

    if (data.rows.length === 0) throw new Error("Academic year not found");

    return data.rows[0];
  } catch (error) {
    console.error("Error in switchStatusAcademicYear:", error);
    throw error;
  }
};

const updateSemesterModel = async (id, passData) => {
  try {
    const { query, values } = updateSemesterServices(id, passData);
    const data = await db.query(query, values);
    return data.rows[0];
  } catch (error) {
    console.error("Error in updateSemesterModel:", error);
    throw error;
  }
};

const updatePasswordModel = async (id) => {
  try {
    const currentUser = await findUserQueryModel(id);
    const { query, values } = await updatePasswordServices(currentUser);
    const data = await db.query(query, values);
    return data.rows[0];
  } catch (error) {
    console.error("Error in updatePasswordModel:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

//++++++++++++++++++ TEST here  +++++++++++++++++++//

/****************** helper Query here ********************/
const findUserQueryModel = async (user_id) => {
  try {
    let currentUser;
    const { query, value } = findUserQueryServices(user_id);
    const result = await db.query(query, value);
    if (result.rows.length === 0) {
      return null;
    }

    currentUser = result.rows[0];

    return currentUser;
  } catch (error) {
    console.error("Error in findUserQueryModel:", error);
    throw error;
  }
};
/****************** helper Query here ********************/

export {
  findUserQueryModel,
  updatePasswordModel,
  updateSemesterModel,
  updateUserModel,
  getAllUsersListModel,
  getAllCoursesModel,
  updateCoursesModel,
  postNewCoursesModel,
  deleteCoursesModel,
  updateCredentialsModel,
  postAcademicYearModel,
  getAcademicYearModel,
  updateStatusAcademicYearModel,
  updateClassStatusAcademicYearModel,
};
