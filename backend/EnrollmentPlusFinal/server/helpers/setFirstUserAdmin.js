import db from "../config/db.js";

const setFirstUserAdmin = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM users");
    const count = parseInt(result.rows[0].count, 10);

    const role = count === 0 ? "admin" : "student";

    return role;
  } catch (error) {
    throw error;
  }
};

export default setFirstUserAdmin;
