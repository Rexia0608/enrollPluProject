import db from "../config/db.js";

const getAllUsersList = async () => {
  try {
    const result = await db.query(
      `SELECT 
    users.id,
    users.first_name,
    users.last_name,
    credentials.email,
    users.role,
    users.status,
    credentials.created_at
FROM credentials
INNER JOIN users
    ON credentials.user_id = users.id;`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAllUsersList:", error);
    throw error;
  }
};

const getAllCoursesList = async () => {
  try {
    const result = await db.query(`SELECT * FROM courses`);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    throw error;
  }
};

const updateCourses = async (id, data) => {
  try {
    const result = await db.query(
      `
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
      `,
      [
        data.course_code,
        data.course_name,
        data.duration_type,
        data.tuition_fee,
        data.course_status,
        id,
      ],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateCourses:", error);
    throw error;
  }
};

// In your AdminModel.js
const addNewCourses = async (data) => {
  try {
    const result = await db.query(
      `
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
      `,
      [
        data.course_code,
        data.course_name,
        data.duration_type,
        data.tuition_fee,
        data.course_status,
      ],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in addNewCourses:", error);
    throw error;
  }
};

const deleteCourses = async (id) => {
  try {
    const result = await db.query(
      `
      DELETE FROM courses 
      WHERE id = $1
      RETURNING *;
      `,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    throw error;
  }
};

const switchStatusMode = async (id, data) => {
  try {
    const result = await db.query(
      `
      UPDATE users 
      SET 
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [data.status, id],
    );

    // Check if user was found and updated
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    console.log("Status updated successfully:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in switchStatusMode:", error);
    throw error;
  }
};

const getAcademicYearlist = async () => {
  try {
    const result = await db.query(
      `SELECT id, year_series, semester, start_date, end_date, enrollment_open FROM academic_year`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAcademicYearlist:", error);
    throw error;
  }
};

// ADD new academic year
const addAcademicYear = async (data) => {
  console.log(data);
  try {
    // Check for duplicates
    const existing = await db.query(
      `SELECT id 
       FROM academic_year 
       WHERE year_series = $1 AND semester = $2`,
      [data.academic_year, data.semester],
    );

    if (existing.rows.length > 0) {
      throw new Error("Academic year and semester already exists.");
    }

    // Insert new academic year
    const result = await db.query(
      `INSERT INTO academic_year 
       (year_series, semester, start_date, end_date, enrollment_open)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.academic_year,
        data.semester,
        data.start_date,
        data.end_date,
        data.enrollment_open ?? false,
      ],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in addAcademicYear:", error);
    throw error;
  }
};

// UPDATE academic year
const updateAcademicYear = async (id, data) => {
  try {
    // Check for duplicates (excluding current record)
    const existing = await db.query(
      `SELECT id 
       FROM academic_year 
       WHERE academic_year = $1 AND semester = $2 AND id != $3`,
      [data.academic_year, data.semester, id],
    );

    if (existing.rows.length > 0) {
      throw new Error("Academic year and semester already exists.");
    }

    const result = await db.query(
      `UPDATE academic_year 
       SET academic_year = $1, 
           semester = $2, 
           start_date = $3, 
           end_date = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [data.academic_year, data.semester, data.start_date, data.end_date, id],
    );

    if (result.rows.length === 0) {
      throw new Error("Academic year not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateAcademicYear:", error);
    throw error;
  }
};

// TOGGLE ENROLLMENT STATUS
const switchStatusAcademicYear = async (data, id) => {
  try {
    // If opening enrollment, close all others first (only one can be open)
    if (data.enrollment_open === true) {
      await db.query(
        `UPDATE academic_year 
         SET enrollment_open = false, updated_at = NOW()
         WHERE id != $1;`,
        [id],
      );
    }

    // Update the target year's enrollment status
    const result = await db.query(
      `UPDATE academic_year
       SET enrollment_open = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`,
      [data.enrollment_open, id],
    );

    if (result.rows.length === 0) throw new Error("Academic year not found");

    return result.rows[0];
  } catch (error) {
    console.error("Error in switchStatusAcademicYear:", error);
    throw error;
  }
};

export {
  getAllUsersList,
  getAllCoursesList,
  updateCourses,
  addNewCourses,
  deleteCourses,
  switchStatusMode,
  addAcademicYear,
  getAcademicYearlist,
  switchStatusAcademicYear,
};
