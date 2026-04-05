import authCodeGenerator from "../utils/AuthCodeGenerator.js";
import { sendEmail } from "../utils/mailer.js";

//++++++++++++++++++ need to refactor +++++++++++++++++++//
const updateCredentialsServices = (id, data) => {
  try {
    let query = `
      UPDATE users 
      SET 
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `;
    let values = [data.status, id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

const AcademicYearExistingServices = (data) => {
  try {
    let queryrExisting = `SELECT id 
       FROM academic_year 
       WHERE year_series = $1 AND semester = $2`;
    let valuesrExisting = [data.year_series, data.semester];
    return { queryrExisting, valuesrExisting };
  } catch (error) {
    console.error("Templated error:", error);
    throw error;
  }
};

const getAllUsersListServices = () => {
  try {
    const query = `SELECT 
    users.id,
    users.first_name,
    users.last_name,
    credentials.email,
    users.role,
    users.status,
    credentials.created_at
FROM credentials
INNER JOIN users
    ON credentials.user_id = users.id;`;
    return { query };
  } catch (error) {
    console.error("getAllUsersListServices error:", error);
    throw error;
  }
};

const getAcademicServices = () => {
  try {
    let query = `SELECT id, year_series, semester, start_date, end_date, is_class_ongoing, enrollment_open FROM academic_year`;
    return { query };
  } catch (error) {
    console.error("getAcademicServices error:", error);
    throw error;
  }
};

const getAllCoursesListServices = () => {
  try {
    let query = `SELECT * FROM courses`;
    return { query };
  } catch (error) {
    console.error("getAllCoursesListSerivces error:", error);
    throw error;
  }
};

const updateCoursesServices = (id, data) => {
  try {
    let query = `
      UPDATE courses 
      SET 
        course_code = $1, 
        course_name = $2, 
        duration_type = $3, 
        tuition_fee = $4, 
        course_status = $5, 
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
      `;
    let values = [
      data.course_code,
      data.course_name,
      data.duration_type,
      data.tuition_fee,
      data.course_status,
      id,
    ];

    return { query, values };
  } catch (error) {
    console.error("updateCoursesServices error:", error);
    throw error;
  }
};

const updateUserServices = (id, data) => {
  try {
    let query = `
      UPDATE users
      SET 
        first_name = $1,
        last_name = $2,
        role = $3,
        status = $4
      WHERE 
        id = $5
      RETURNING *;
    `;
    let values = [
      data.first_name,
      data.last_name,
      data.role,
      data.status,
      id.user_id,
    ];
    return { query, values };
  } catch (error) {
    console.error("error updateUserServices:", error);
    throw error;
  }
};

const postNewCoursesServices = (data) => {
  try {
    let query = `
      INSERT INTO courses (
        course_code,
        course_name,
        duration_type,
        tuition_fee,
        course_status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
      `;
    let values = [
      data.course_code,
      data.course_name,
      data.duration_type,
      data.tuition_fee,
      data.course_status,
    ];
    return { query, values };
  } catch (error) {
    console.error("postNewCoursesServices error:", error);
    throw error;
  }
};

const deleteCoursesServices = (id) => {
  try {
    let query = `
      DELETE FROM courses 
      WHERE id = $1
      RETURNING *;
      `;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("deleteCoursesServices error:", error);
    throw error;
  }
};

const postAcademicYearModelServices = (data) => {
  try {
    let query = `INSERT INTO academic_year 
       (year_series, semester, start_date, end_date, is_class_ongoing, enrollment_open)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`;
    let values = [
      data.year_series,
      data.semester,
      data.start_date,
      data.end_date,
      true,
      data.enrollment_open ?? false,
    ];
    return { query, values };
  } catch (error) {
    console.error("error postAcademicYearModelServices:", error);
    throw error;
  }
};

const updateStatusCloseAllAcademicYearServices = (id) => {
  try {
    let query = `UPDATE academic_year 
         SET enrollment_open = false, updated_at = NOW()
         WHERE id != $1;`;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusCloseAllAcademicYearServices:", error);
    throw error;
  }
};

const updateStatusAcademicYearServices = (data, id) => {
  try {
    let query = `UPDATE academic_year
       SET enrollment_open = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`;
    let values = [data, id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateClassCloseStatusAcademicYearServices = (id) => {
  try {
    let query = `UPDATE academic_year 
         SET is_class_ongoing = false, updated_at = NOW()
         WHERE id != $1;`;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("error updateClassCloseStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateClassStatusAcademicYearServices = (passData, id) => {
  try {
    let queryClose = `UPDATE academic_year
       SET is_class_ongoing = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`;
    let valuesClose = [passData, id];
    return { queryClose, valuesClose };
  } catch (error) {
    console.error("error updateClassStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateSemesterServices = (id, data) => {
  console.log(data);
  try {
    let query = `UPDATE academic_year
                SET 
                  year_series = $1,
                  semester = $2, 
                  start_date = $3,
                  end_date = $4
                WHERE 
                  id = $5
                RETURNING *;
    `;
    let values = [
      data.year_series,
      data.semester,
      data.start_date,
      data.end_date,
      id,
    ];
    return { query, values };
  } catch (error) {
    console.error("error updateSemesterServices:", error);
    throw error;
  }
};

const updatePasswordServices = async (passData) => {
  try {
    const { otpExpires } = await authCodeGenerator();
    let query = `
      UPDATE credentials
      SET otp_expires_at = $1, 
      is_verified = $2
      WHERE user_id = $3
      RETURNING email; 
    `;
    let values = [otpExpires, false, passData.id];
    let message = `http://localhost:5173/password-reset/${passData.id}`;
    await sendEmail("password-reset", passData.email, message);
    return { query, values };
  } catch (error) {
    console.error("error updatePasswordServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ test here  updatePasswordServices +++++++++++++++++++//

const Templated = () => {
  try {
    let query = ``;
    let values = [];
    return { query, values };
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

//++++++++++++++++++ test here +++++++++++++++++++//

//++++++++++++++++++ helper Query here +++++++++++++++++++//
const findUserQueryServices = (id) => {
  try {
    let query = `SELECT 
                  u.id,
                  u.first_name,
                  u.last_name,
                  u.role,
                  u.status,
                  u.created_at,
                  u.updated_at,
                  c.email,
                  c.password,
                  c.mobile_number,
                  c.is_verified,
                  c.login_attempts,
                  c.created_at AS credentials_created_at,
                  c.updated_at AS credentials_updated_at
              FROM users u
              JOIN credentials c 
                  ON u.id = c.user_id
              WHERE u.id = $1`;
    let value = [id];

    return { query, value };
  } catch (error) {
    console.error("Error in findUserQueryServices:", error);
    throw error;
  }
};
//++++++++++++++++++ helper Query here +++++++++++++++++++//

export {
  updateClassCloseStatusAcademicYearServices,
  updateStatusCloseAllAcademicYearServices,
  updateClassStatusAcademicYearServices,
  updateStatusAcademicYearServices,
  postAcademicYearModelServices,
  AcademicYearExistingServices,
  updateCredentialsServices,
  updatePasswordServices,
  deleteCoursesServices,
  postNewCoursesServices,
  getAcademicServices,
  updateUserServices,
  getAllUsersListServices,
  getAllCoursesListServices,
  updateCoursesServices,
  updateSemesterServices,
  findUserQueryServices,
};
