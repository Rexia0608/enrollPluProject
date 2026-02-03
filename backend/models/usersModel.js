import db from "../config/db.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/mailer.js";

const registerUserModel = async (data) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // 1️⃣ Check if email exists
    const isAlreadyRegistered = await checkIfTheUserExist(data.email);
    if (isAlreadyRegistered) {
      return { error: "Email is already in use." };
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
        user_id, email, password, email_otp, otp_expires_at, is_verified
      )
      VALUES ($1, $2, $3, $4, $5, false)
    `;
    await db.query(credQuery, [
      userId,
      data.email,
      hashPassword,
      otp,
      otpExpires,
    ]);

    // 4️⃣ Send OTP
    await sendOTPEmail(data.email, otp);

    return { message: "OTP sent successfully", email: data.email };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

const checkIfTheUserExist = async (email) => {
  const query = `SELECT 1 FROM credentials WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows.length > 0;
};

export { registerUserModel, checkIfTheUserExist };
