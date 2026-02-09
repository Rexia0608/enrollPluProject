import db from "../config/db.js";

// Insert a new course
const insertCourseModel = async (data) => {
  try {
    console.log(req.user.formattedUser.role);
    const query = `
      INSERT INTO courses (course_code, course_name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [data.course_code, data.course_name];

    const result = await db.query(query, values);
    return result.rows[0]; // inserted row
  } catch (error) {
    throw error;
  }
};

// Check if a course already exists
const checkIfCourseExist = async (data) => {
  try {
    const query = `
      SELECT * FROM courses 
      WHERE course_code = $1 OR course_name = $2
      LIMIT 1;
    `;
    const values = [data.course_code, data.course_name];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all courses
const getAllCoursesModel = async () => {
  try {
    const query = `SELECT * FROM courses ORDER BY course_code ASC;`;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const deleteCourseModel = async (course_id, is_active, user) => {
  console.log(user);
  if (user !== "admin") {
    const err = new Error("Only admins can update course status.");
    err.status = 403;
    throw err;
  }

  const result = await db.query(
    `UPDATE courses
     SET is_active = $1
     WHERE course_id = $2
     RETURNING *`,
    [is_active, course_id]
  );

  if (!result.rows[0]) {
    const err = new Error("Course not found.");
    err.status = 404;
    throw err;
  }

  return result.rows[0];
};

export {
  insertCourseModel,
  checkIfCourseExist,
  getAllCoursesModel,
  deleteCourseModel,
};
