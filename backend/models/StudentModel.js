import db from "../config/db.js";

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
    const facultyDefaultValidation = {
      document: false,
      isProfileAreValidated: false,
      remarkNote: "wait for the validation team from faculty office.",
    };

    const statusMap = {
      old_student: "payment_pending",
      new: "documents_approved",
      transferee: "documents_approved",
    };

    const enrollStatus = statusMap[data.studentType];

    // Begin transaction
    await db.query("BEGIN");

    // 1️⃣ Insert enrollment profile if not exists
    const result = await db.query(
      `INSERT INTO enrollment_profile (
          course_code_id, user_id, enrollment_year_code, enrollment_status, student_type, year_level, remarks
        )
       SELECT $1, $2, $3, $4, $5, $6, $7::jsonb
       WHERE NOT EXISTS (
         SELECT 1 FROM enrollment_profile 
         WHERE user_id = $2 AND enrollment_year_code = $3
       )
       RETURNING *;`,
      [
        data.course,
        data.studentId,
        data.academicYearId,
        enrollStatus,
        data.studentType,
        data.yearLevel,
        JSON.stringify(facultyDefaultValidation),
      ],
    );

    // 2️⃣ Insert transactions if enrollment was created
    if (result.rows.length > 0) {
      const enrollmentId = result.rows[0].enrollment_id;

      // Fetch tuition fee
      const courseResult = await db.query(
        `SELECT tuition_fee FROM courses WHERE id = $1`,
        [data.course],
      );
      const tuitionFee = parseFloat(courseResult.rows[0].tuition_fee);

      // 3️⃣ Insert 6-period transactions
      await db.query(
        `INSERT INTO transaction_table (
      enrollment_id,
      period,
      course_tuition_fee,
      paid,
      balance,
      payment_per_period
    )
   SELECT
      $1 AS enrollment_id,
      period,
      $2 AS course_tuition_fee,
      0.00 AS paid,
      CASE WHEN period = 'enrollment' THEN $3 ELSE 0 END AS balance,
      CASE WHEN period = 'enrollment' THEN $4 ELSE 0 END AS payment_per_period
   FROM (VALUES 
        ('enrollment'),
        ('prelim'),
        ('mid-term'),
        ('pre-final'),
        ('final'), 
        ('summer')
   ) AS periods(period);`,
        [enrollmentId, data.course, tuitionFee, 0],
      );
    }

    // Commit transaction
    await db.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    // Rollback on error
    await db.query("ROLLBACK");
    throw error;
  }
};

//*******************finalized*****************************/
const postPaymentModel = async (data) => {
  try {
    const scenario = data?.scenario || "1";

    const SCENARIO_1 = {
      data: {
        data: {
          nextPayment: {
            period: "prelim",
            amount: 1000.0,
          },
          paymentSummary: {
            totalTuition: 5000.0,
            remainingBalance: 4000.0,
          },
        },
      },
    };

    const SCENARIO_2 = {
      data: {
        transaction: {
          id: "PAY-TEST-001",
          enrollment_id: "ENR-TEST-001",
          period: "prelim",
          course_tuition_fee: 25000.0,
          paid: 2000.0,
          balance: 23000.0,
          payment_per_period: 5000.0,
          payment_type: "gcash",
          remark: {
            reference_number: "REF123456",
            remarks: "Test partial payment",
          },
          updated_at: new Date().toISOString(),
        },
      },
    };

    const SCENARIO_3 = {
      data: null, // No data, will force refetch
    };

    let result;
    switch (scenario) {
      case "1":
        result = SCENARIO_1;
        break;
      case "2":
        result = SCENARIO_2;
        break;
      case "3":
        result = SCENARIO_3;
        break;
      default:
        result = SCENARIO_1;
    }

    return result;
  } catch (error) {
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
