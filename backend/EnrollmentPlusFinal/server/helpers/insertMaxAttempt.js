import db from "../config/db.js";
import { getUserByEmailModel } from "../models/accountsUserModel.js";
import emailFormater from "./emailFormater.js";
import { sendEmail } from "../utils/sendEmail.js";

const insertMaxAttempt = async (email) => {
  try {
    const user = await getUserByEmailModel(email);
    if (!user) {
      throw new Error("User not found");
    }
    const query = `
    UPDATE users
    SET 
        max_attempt = LEAST(max_attempt + 1, 5),  -- never exceed 5
        is_active = CASE
            WHEN max_attempt + 1 >= 5 THEN FALSE
            ELSE is_active
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = $1
    RETURNING max_attempt, is_active;
        `;

    const values = [user.email];
    const result = await db.query(query, values);
    const updatedUser = result.rows[0];
    if (updatedUser && updatedUser.max_attempt >= 5) {
      sendEmail(emailFormater(user));
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating max_attempt:", error.message);
    throw error;
  }
};

const insertMaxAttemptReset = async (email) => {
  try {
    const user = await getUserByEmailModel(email);
    if (!user) {
      throw new Error("User not found");
    }

    const query = `
      UPDATE users
      SET max_attempt = 0,
          is_active = TRUE,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = $1
      RETURNING max_attempt, is_active;
    `;

    const values = [user.email];
    const result = await db.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Error resetting max_attempt:", error.message);
    throw error;
  }
};

export { insertMaxAttempt, insertMaxAttemptReset };
