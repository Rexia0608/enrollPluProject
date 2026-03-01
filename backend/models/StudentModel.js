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

const createEnrollment = async (enrollmentData) => {
  const {
    studentId,
    studentType,
    contactNumber,
    address,
    yearLevel,
    course,
    academicYear,
    semester,
    fullName,
    email,
    birthDate,
    gender,
    status,
  } = enrollmentData;
  console.log(
    studentId,
    studentType,
    contactNumber,
    address,
    yearLevel,
    course,
    academicYear,
    semester,
    fullName,
    email,
    birthDate,
    gender,
    status,
  );
  try {
    // Adjust this SQL to match your actual table structure
    // const query = `
    //   INSERT INTO enrollments
    //   (student_id, student_type, contact_number, address, year_level, course,
    //    academic_year, semester, full_name, email, birth_date, gender, status, created_at)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    // `;
    // const values = [
    //   studentId,
    //   studentType,
    //   contactNumber,
    //   address,
    //   yearLevel,
    //   course,
    //   academicYear,
    //   semester,
    //   fullName,
    //   email,
    //   birthDate,
    //   gender,
    //   status,
    // ];
    // const [result] = await db.execute(query, values);
    // return {
    //   id: result.insertId, // Return the new enrollment ID
    //   ...enrollmentData,
    // };
  } catch (error) {
    console.error("Error creating enrollment:", error);
    throw error;
  }
};

export { getAllCoursesList, getAcademicYearlist, createEnrollment };
