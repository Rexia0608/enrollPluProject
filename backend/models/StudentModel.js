import db from "../config/db.js";

const getAllCoursesList = async () => {
  try {
    const result = await db.query(`SELECT * FROM courses ORDER BY id`);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

const getAcademicYearlist = async () => {
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
    // Check if student already has an enrollment profile
    const result = await db.query(
      `SELECT * FROM enrollment_profile WHERE user_id = $1`,
      [data.studentId],
    );

    console.log("Enrollment data received:", data);

    // If NO existing enrollment found, create one
    if (result.rows.length === 0) {
      // Map studentType to database value
      const studentTypeMap = {
        old: "old_student",
        new: "new",
        transferee: "transferee",
      };

      const dbStudentType = studentTypeMap[data.studentType];

      if (!dbStudentType) {
        throw new Error(`Invalid student type: ${data.studentType}`);
      }

      const query = `
        INSERT INTO enrollment_profile (
          course_code_id,
          user_id,
          enrollment_year_code,
          enrollment_status,
          student_type,
          year_level,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
      `;

      const values = [
        data.course,
        data.studentId,
        data.academicYearId,
        "documents_approved",
        dbStudentType,
        data.yearLevel,
      ];

      const insertResult = await db.query(query, values);

      return {
        success: true,
        message: "Enrollment profile created successfully",
        data: insertResult.rows[0],
      };
    }

    // Return existing enrollment if found
    return {
      success: true,
      message: "Student already has an enrollment profile",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error in enrollStudentModel:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

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
  getAcademicYearlist,
  enrollStudentModel,
  getMyEnrollmentModel,
  getEnrollmentProfileModel,
};
