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
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCoursesList = async () => {
  try {
    const result = await db.query(`SELECT * FROM courses`);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllCoursesList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

getAllCoursesList();

export { getAllUsersList, getAllCoursesList };
