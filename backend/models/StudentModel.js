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

const getAllCoursesList = async () => {
  try {
    const result = await db.query(`SELECT * FROM courses ORDER BY id`);
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

const enrollStudentModel = async (data) => {
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

    const result = await db.query(
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

    return {
      inserted: result.rowCount > 0,
      userId: result.rows[0]?.user_id || null,
    };
  } catch (error) {
    throw error;
  }
};

//*******************finalized*****************************/

const getMyEnrollmentModel = async (userId) => {
  try {
    const query = `
      SELECT 
        ep.*,
        c.course_name,
        c.course_code,
        ay.year_series as academic_year,
        ay.semester
      FROM enrollment_profile ep
      LEFT JOIN courses c ON ep.course_code_id = c.id
      LEFT JOIN academic_year ay ON ep.enrollment_year_code = ay.id
      WHERE ep.user_id = $1
      ORDER BY ep.created_at DESC
      LIMIT 1;
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No enrollment found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Enrollment retrieved successfully",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error in getMyEnrollmentModel:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const getEnrollmentProfileModel = async (data) => {
  try {
    const query = `SELECT * FROM enrollment_profile WHERE user_id = $1`;
    const values = [data.user_id];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getEnrollmentProfileModel:", error);
    throw new Error(`Failed to get enrollment profile: ${error.message}`);
  }
};

const postPaymentModel = async (data) => {
  try {
    console.log(data);
  } catch (error) {
    console.error("Error in postPaymenModel:", error);
    throw new Error(`Failed to post Payment: ${error.message}`);
  }
};

export {
  postPaymentModel,
  getAllCoursesList,
  getAcademicYearlistModel,
  enrollStudentModel,
  getMyEnrollmentModel,
  getEnrollmentProfileModel,
  getCheckStudentIfEnrolledModel,
};
