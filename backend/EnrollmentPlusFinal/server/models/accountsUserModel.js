import db from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import config from "../config/auth.js";
import setFirstUserAdmin from "../helpers/setFirstUserAdmin.js";

import {
  insertMaxAttempt,
  insertMaxAttemptReset,
} from "../helpers/insertMaxAttempt.js";
dotenv.config();

const accountRegisterModel = async (data) => {
  try {
    // 1. Check if user already exists
    const existingUser = await getUserByEmailModel(data.email);
    if (existingUser) {
      const error = new Error(
        "User already exists with this email, please try to login."
      );
      error.statusCode = 400;
      throw error;
    }

    // 2. Decide role for the new user
    const role = await setFirstUserAdmin();

    // 3. Hash password
    const hash = await bcrypt.hash(
      data.password + config.auth.pepper,
      Number(config.auth.saltRound)
    );

    // 4. Insert new user
    const query = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [
      data.email,
      hash,
      role,
      data.first_name,
      data.last_name,
      true,
    ];
78
    const newUser = await db.query(query, values);
    return newUser.rows[0];
  } catch (error) {
    throw error;
  }
};

// ---------------- LOGIN ----------------
const accountLoginModel = async (data) => {
  try {
    const user = await getUserByEmailModel(data.email);
    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(
      data.password + config.auth.pepper,
      user.password_hash
    );

    if (!validPassword) {
      const result = await insertMaxAttempt(data.email);
      const remaining = Math.max(0, 5 - result.max_attempt);
      const error = new Error(
        remaining > 0
          ? `Invalid email or password. You have ${remaining} attempt(s) left.`
          : "Your account has been locked due to too many failed login attempts. We sent an email for your password recovery."
      );
      error.statusCode = 401;
      throw error;
    }

    await insertMaxAttemptReset(data.email);
    return user;
  } catch (error) {
    throw error;
  }
};

// ---------------- accountChangePassword ----------------
const accountChangePasswordModel = async (data) => {
  try {
    const existingUser = await getUserByEmailModel(data.email);
    const samerRecentPassword = await bcrypt.compare(
      data.password + config.auth.pepper,
      existingUser.password_hash
    );

    if (samerRecentPassword) {
      const error = new Error(
        "Recent Passowrd won't allow please use new password."
      );
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const getUserByEmailModel = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const result = await db.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export {
  accountRegisterModel,
  accountLoginModel,
  accountChangePasswordModel,
  getUserByEmailModel,
};
