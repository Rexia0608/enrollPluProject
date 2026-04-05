import db from "../config/db.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailer.js";
import authCodeGenerator from "../utils/AuthCodeGenerator.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import {
  UsersAuthtokenServices,
  userAuthSetPasswordServices,
} from "../services/securityServices.js";

const registerUserModel = async (data) => {
  try {
    const { otp, otpExpires } = await authCodeGenerator();

    // 1️⃣ Check if email exists
    const isAlreadyRegistered = await checkIfTheUserExist(data.email);
    if (isAlreadyRegistered.length > 0) {
      return {
        error:
          "Email is already in use. Please try to login using your credentials.",
      };
    }

    // 2️⃣ Insert user (assumes id is UUID defaulted in DB)
    const userQuery = `
      INSERT INTO users (first_name, last_name, birthdate, gender)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const userValues = [data.fName, data.lName, data.birthDate, data.gender];
    const userResult = await db.query(userQuery, userValues);
    const userId = userResult.rows[0].id;

    // 3️⃣ Insert credentials
    const hashPassword = await bcrypt.hash(data.password, 10);
    const credQuery = `
      INSERT INTO credentials (
        user_id, email, mobile_number, password, email_otp, otp_expires_at, is_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, false)
    `;
    await db.query(credQuery, [
      userId,
      data.email,
      data.mNumber,
      hashPassword,
      otp,
      otpExpires,
    ]);

    await sendEmail("sending_OTP", data.email, otp);
    await firstUserAdminSetRole(userId);

    return {
      message: `OTP sent successfully to ${data.email}`,
      email: data.email,
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

const loginUserModel = async (data) => {
  try {
    const user = await checkIfTheUserExist(data.email);

    if (!user || user.length === 0) {
      return { error: "Invalid credentials" };
    }

    if (!user[0].is_verified) {
      return { error: "Email is not yet verified.", user: user[0].email };
    }

    const validPassword = await bcrypt.compare(data.password, user[0].password);

    if (!validPassword) {
      return { error: "Invalid credentials" };
    }

    const token = jwtGenerator(user[0].user_id);

    // ✅ Return user object + token
    return {
      user: {
        id: user[0].id,
        name: user[0].first_name + " " + user[0].last_name,
        birthdate: user[0].birthdate,
        gender: user[0].gender,
        email: user[0].email,
        mobile: user[0].mobile_number,
        auth: user[0].is_verified,
        role: user[0].role,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const checkIfTheUserExist = async (email) => {
  const query = `SELECT 
    users.id,
	  users.role,
    users.first_name,
    users.last_name,
    users.birthdate,
    users.gender,
    credentials.email,
    credentials.mobile_number,
    credentials.password,
    credentials.login_attempts,
    credentials.email_otp,
    credentials.otp_expires_at,
    credentials.is_verified
FROM credentials
INNER JOIN users ON credentials.user_id = users.id
WHERE credentials.email = $1;`;
  const result = await db.query(query, [email]);
  return result.rows;
};

const firstUserAdminSetRole = async (userId) => {
  try {
    console.log(userId);
    const result = await db.query(`SELECT COUNT(*) AS total_users FROM users;`);

    const totalUsers = parseInt(result.rows[0].total_users, 10);

    const role = totalUsers === 1 ? "admin" : "student";

    await db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, userId]);
    await db.query(`UPDATE users SET status = $1 WHERE id = $2`, [
      true,
      userId,
    ]);
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

const userAuthPasswordModel = async (passData) => {
  try {
    const { query, value, isTokenValid } = UsersAuthtokenServices(passData);
    const data = await db.query(query, value);
    const otpExpires = new Date(data.rows[0].otp_expires_at);
    const now = new Date();
    return isTokenValid && otpExpires > now ? true : false;
  } catch (error) {
    console.error("userAuthPasswordModel error:", error);
    throw error;
  }
};

const userAuthSetPasswordModel = async (id, passData) => {
  try {
    const hashPassword = await bcrypt.hash(passData, 10);

    const { query, values } = userAuthSetPasswordServices(id, hashPassword);

    const updatedData = await db.query(query, values);

    await sendEmail(
      "password-set",
      updatedData.rows[0].email,
      updatedData.rows[0].email,
    );

    return updatedData.rows[0].email;
  } catch (error) {
    console.error("userAuthPasswordModel error:", error);
    throw error;
  }
};

export {
  userAuthSetPasswordModel,
  registerUserModel,
  checkIfTheUserExist,
  loginUserModel,
  userAuthPasswordModel,
};
