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

const postEnrollStudentModel = async (data) => {
  try {
    const studentTypeMap = {
      old: "old_student",
      new: "new",
      transferee: "transferee",
    };

    const dbStudentType = studentTypeMap[data.studentType];

    if (!dbStudentType) {
      throw new Error(`Invalid student type: ${data.studentType}`);
    }

    // First, get the course tuition fee
    const courseResult = await db.query(
      `SELECT tuition_fee FROM courses WHERE id = $1`,
      [data.course],
    );

    if (courseResult.rows.length === 0) {
      throw new Error("Course not found");
    }

    const tuitionFee = courseResult.rows[0].tuition_fee;
    const paymentPerPeriod = tuitionFee / 5;

    // Insert enrollment profile
    const enrollmentResult = await db.query(
      `
      INSERT INTO enrollment_profile (
        course_code_id,
        user_id,
        enrollment_year_code,
        enrollment_status,
        student_type,
        year_level,
        created_at,
        updated_at
      )
      SELECT $1, $2, $3, $4, $5, $6, NOW(), NOW()
      WHERE 
        -- ensure academic year is open
        EXISTS (
          SELECT 1 
          FROM academic_year 
          WHERE id = $3 
          AND enrollment_open = true
        )
      AND 
        -- ensure student is not already enrolled in an open year
        NOT EXISTS (
          SELECT 1
          FROM enrollment_profile ep
          INNER JOIN academic_year ay 
            ON ep.enrollment_year_code = ay.id
          WHERE ep.user_id = $2
          AND ay.enrollment_open = true
        )
      RETURNING *;
      `,
      [
        data.course,
        data.studentId,
        data.academicYearId,
        "documents_approved",
        dbStudentType,
        data.yearLevel,
      ],
    );

    // Check if enrollment was successful
    if (enrollmentResult.rows.length > 0) {
      const enrollment = enrollmentResult.rows[0];

      // Insert transaction record
      await db.query(
        `INSERT INTO transaction_table (
          enrollment_id,
          period, 
          course_tuition_fee,
          paid, 
          balance, 
          payment_per_period,
          payment_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          enrollment.enrollment_id,
          "enrollment",
          enrollment.course_code_id,
          0.0,
          tuitionFee,
          paymentPerPeriod,
          data.paymentType || null,
        ],
      );
    }

    return {
      inserted: enrollmentResult.rowCount > 0,
      userId: enrollmentResult.rows[0]?.user_id || null,
    };
  } catch (error) {
    throw error;
  }
};

const getCheckStudentPaymentModel = async (data) => {
  try {
    const result = await db.query(
      `SELECT * 
          FROM transaction_table 
          WHERE enrollment_id = $1
          ORDER BY created_at DESC 
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

//*******************finalized*****************************/

export {
  getAllCoursesListModel,
  getAcademicYearlistModel,
  postEnrollStudentModel,
  getCheckStudentPaymentModel,
  getCheckStudentIfEnrolledModel,
};
