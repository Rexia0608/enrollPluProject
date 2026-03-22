import db from "../config/db.js";
import { paymentService } from "../services/paymentService.js";
import {
  enrollmentProfileServices,
  enrollmentTransactionServices,
} from "../services/enrollmentServices.js";

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
          ORDER BY created_at ASC
          LIMIT 1;`,
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
      `
      SELECT 
          c.tuition_fee,
          ay.semester
      FROM courses c
      JOIN academic_year ay ON ay.id = $2
      WHERE c.id = $1
      `,
      [data.course, data.academicYearId],
    );
    const { profileQuery, profileValue } =
      await enrollmentProfileServices(data);
    const { tuition_fee, semester } = findCourse.rows[0];
    const { transactionQuery, enrollmentFee } =
      await enrollmentTransactionServices(tuition_fee, semester);
    const parsedTuitionFee = parseFloat(tuition_fee);
    await db.query("BEGIN");

    const result = await db.query(profileQuery, profileValue);

    await db.query(transactionQuery, [
      result.rows[0].enrollment_id,
      data.course,
      parsedTuitionFee,
      enrollmentFee,
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

//*******************finalized*****************************/
// const postPaymentModel = async (data) => {
//   try {
//     const scenario = data?.scenario || "1";

//     const SCENARIO_1 = {
//       data: {
//         data: {
//           nextPayment: {
//             period: "prelim",
//             amount: 1000.0,
//           },
//           paymentSummary: {
//             totalTuition: 5000.0,
//             remainingBalance: 4000.0,
//           },
//         },
//       },
//     };

//     const SCENARIO_2 = {
//       data: {
//         transaction: {
//           id: "PAY-TEST-001",
//           enrollment_id: "ENR-TEST-001",
//           period: "prelim",
//           course_tuition_fee: 25000.0,
//           paid: 2000.0,
//           balance: 23000.0,
//           payment_per_period: 5000.0,
//           payment_type: "gcash",
//           remark: {
//             reference_number: "REF123456",
//             remarks: "Test partial payment",
//           },
//           updated_at: new Date().toISOString(),
//         },
//       },
//     };

//     const SCENARIO_3 = {
//       data: null, // No data, will force refetch
//     };

//     let result;
//     switch (scenario) {
//       case "1":
//         result = SCENARIO_1;
//         break;
//       case "2":
//         result = SCENARIO_2;
//         break;
//       case "3":
//         result = SCENARIO_3;
//         break;
//       default:
//         result = SCENARIO_1;
//     }

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

const postPaymentModel = async (data) => {
  try {
    const { pass } = await paymentService(data);
    console.log(pass);
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  postPaymentModel,
  postEnrollStudentModel,
  getAllCoursesListModel,
  getAcademicYearlistModel,
  getCheckStudentPaymentModel,
  getCheckStudentIfEnrolledModel,
};
