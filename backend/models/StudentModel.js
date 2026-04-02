import db from "../config/db.js";
import {
  paymentUpdateService,
  paymentPeriodService,
  paymentService,
} from "../services/paymentService.js";
import {
  enrollmentProfileServices,
  enrollmentTransactionServices,
} from "../services/studentServices.js";

//*******************finalized*****************************/
const getCheckStudentIfEnrolledModel = async (userId) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM enrollment_profile ep
       JOIN academic_year ay
         ON ep.enrollment_year_code = ay.id
       WHERE ay.enrollment_open = true
       AND ep.user_id = $1`,
      [userId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getCheckStudentIfEnrolledModel:", error);
    throw new Error(
      `Failed to fetch get Check Student If Enrolled: ${error.message}`,
    );
  }
};

const getAllCoursesListModel = async () => {
  try {
    const result = await db.query(
      `SELECT * FROM courses WHERE course_status = 'active' ORDER BY id;`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

const getAcademicYearlistModel = async () => {
  try {
    const result = await db.query(
      `SELECT id, year_series, semester, start_date, end_date, enrollment_open
        FROM academic_year
        WHERE enrollment_open = 'true'`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAcademicYearlist:", error);
    throw error;
  }
};

const getCheckStudentPaymentModel = async (data) => {
  try {
    const result = await db.query(
      `SELECT * 
          FROM transaction_table 
          WHERE enrollment_id = $1 
          AND payment_status = 'pending'`,
      [data.enrollment_id],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getCheckStudentIfEnrolledModel:", error);
    throw new Error(
      `Failed to fetch get Check Student If Enrolled: ${error.message}`,
    );
  }
};

const postEnrollStudentModel = async (data) => {
  try {
    const findCourse = await db.query(
      `SELECT id, tuition_fee FROM courses WHERE id = $1`,
      [data.course],
    );

    const findActiveSemester = await db.query(
      `SELECT semester FROM academic_year WHERE id = $1`,
      [data.academicYearId],
    );

    const { profileQuery, profileValue } = enrollmentProfileServices(data);

    const { transactionQuery, enrollmentFee } = enrollmentTransactionServices(
      findCourse.rows[0].tuition_fee,
      findActiveSemester.rows[0].semester,
    );

    const parsedEnrollmentFee = parseFloat(enrollmentFee);
    const parsedBalance = parseFloat(findCourse.rows[0].tuition_fee);
    await db.query("BEGIN");

    const result = await db.query(profileQuery, profileValue);

    await db.query(transactionQuery, [
      result.rows[0].enrollment_id,
      parsedBalance,
      parsedEnrollmentFee,
    ]);

    const users = await db.query(
      `UPDATE users SET address = $1 WHERE id = $2 RETURNING first_name, last_name`,
      [data.address, data.studentId],
    );

    const { first_name, last_name } = users.rows[0];

    await db.query(
      `UPDATE credentials SET mobile_number = $1 WHERE user_id = $2 `,
      [data.contactNumber, data.studentId],
    );

    await db.query("COMMIT");

    console.log(`new enrollees added, name: ${first_name} ${last_name}`);

    return result.rows[0];
  } catch (error) {
    await db.query("ROLLBACK");
    console.error(error);
    throw error;
  }
};

const postPaymentModel = async (data) => {
  try {
    let result;
    let response;

    const { query, value, paid } = paymentUpdateService(data);

    if (paid) {
      result = await db.query(query, value);
      response = await paymentService(result.rows[0], paid, data);
      return response;
    }

    if (!paid) {
      result = await db.query(query, value);
      response = await paymentService(result.rows[0], paid, data);
      const { nextQuery, nextValue } = paymentPeriodService(result.rows[0]);
      await db.query(nextQuery, nextValue);
      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//*******************finalized*****************************/

export {
  postPaymentModel,
  postEnrollStudentModel,
  getAllCoursesListModel,
  getAcademicYearlistModel,
  getCheckStudentPaymentModel,
  getCheckStudentIfEnrolledModel,
};
