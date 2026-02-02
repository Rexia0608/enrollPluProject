import db from "../config/db.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/mailer.js";

const registerUserModel = async (data) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    const isAlreadyRegistered = await checkIfTheUserExist(data.email);

    if (isAlreadyRegistered) {
      return `Email is already in used.`;
    } else {
      const userQuery = `INSERT INTO users (first_name, last_name, birthdate, gender)
    VALUES ($1, $2, $3, $4) RETURNING *`;

      const credQuery = `INSERT INTO credentials (user_id, email, password) 
    VALUES ($1, $2, $3) RETURNING *`;

      const credOtp = `UPDATE credentials SET last_login = $1 WHERE user_id = $2`;
      const credOtpValue = [otp, data.email];
      const userValues = [data.fName, data.lName, data.birthDate, data.gender];
      const userResult = await db.query(userQuery, userValues);
      const hashPassword = await bcrypt.hash(data.password, 10);
      const credValues = [userResult.rows[0].id, data.email, hashPassword];
      const finalResult = await db.query(credQuery, credValues);
      const token = jwtGenerator(finalResult.rows[0].id);
      await sendOTPEmail(data.email, otp);
      await db.query(credOtp, credOtpValue);
      console.log(`OTP sent! to ${data.email}`);
      return token;
    }
  } catch (error) {
    console.log(error.detail);
  }
};

const checkIfTheUserExist = async (email) => {
  const query = `SELECT 1 FROM credentials WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows.length > 0;
};

export { registerUserModel, checkIfTheUserExist };
