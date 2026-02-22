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
        code = $1, 
        name = $2, 
        type = $3, 
        tuition_fee = $4, 
        status = $5, 
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
      `,
      [data.code, data.name, data.type, data.tuition_fee, data.status, id],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateCourses:", error);
    throw error;
  }
};

const addNewCourses = async (data) => {
  try {
    const result = await db.query(
      `
      INSERT INTO courses (
        code,
        name,
        type,
        tuition_fee,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW(),
        NOW()
      )
      RETURNING *;
      `,
      [data.code, data.name, data.type, data.tuition_fee, data.status],
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
    console.log("Switching status for user:", id, data);

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

export {
  getAllUsersList,
  getAllCoursesList,
  updateCourses,
  addNewCourses,
  deleteCourses,
  switchStatusMode,
};
