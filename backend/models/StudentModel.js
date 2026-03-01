import db from "../config/db.js";

const getAllCoursesList = async () => {
  try {
    const result = await db.query(`SELECT * FROM courses`);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    throw error;
  }
};

const getAcademicYearlist = async () => {
  try {
    const result = await db.query(
      `SELECT id, academic_year, semester, start_date, end_date, enrollment_open 
        FROM academic_year 
        WHERE enrollment_open = 'true'`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getAcademicYearlist:", error);
    throw error;
  }
};

export { getAllCoursesList, getAcademicYearlist };
