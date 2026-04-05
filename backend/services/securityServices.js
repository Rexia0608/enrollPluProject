import bcrypt from "bcrypt";
import db from "../config/db.js";
import { sendEmail } from "../utils/mailer.js";
import authCodeGenerator from "../utils/AuthCodeGenerator.js";
import { checkIfTheUserExist } from "../models/UsersAuthModel.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

const registerUserServices = async (passData) => {
  try {
    const query = `
      INSERT INTO users (first_name, last_name, birthdate, gender)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const values = [
      passData.fName,
      passData.lName,
      passData.birthDate,
      passData.gender,
    ];

    return { query, values };
  } catch (error) {
    console.error("error registerUserServices:", error);
    throw error;
  }
};

const registerCredentailsUserServices = async (userId, passData) => {
  try {
    const { otp, otpExpires } = await authCodeGenerator();
    const hashPassword = await bcrypt.hash(passData.password, 10);
    const credQuery = `
      INSERT INTO credentials (
        user_id, email, mobile_number, password, email_otp, otp_expires_at, is_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING email;
    `;
    const credValues = [
      userId,
      passData.email,
      passData.mNumber,
      hashPassword,
      otp,
      otpExpires,
    ];

    await userAuthEmailSenderServices("sending_OTP", passData.email, otp);

    return { credQuery, credValues };
  } catch (error) {
    console.error("error registerCredentailsUserServices:", error);
    throw error;
  }
};

const userAuthSetPasswordServices = async (id, passData) => {
  try {
    const hashPassword = await bcrypt.hash(passData, 10);
    let query = `UPDATE credentials
                 SET password = $1
                 WHERE user_id = $2
                 RETURNING email;
    `;
    let values = [hashPassword, id];
    return { query, values };
  } catch (error) {
    console.error("error userAuthSetPasswordServices:", error);
    throw error;
  }
};

const resendOtpServices = async (email) => {
  try {
    const { otp, otpExpires } = await authCodeGenerator();
    let query = `UPDATE credentials SET is_verified = false, email_otp = $1, otp_expires_at = $2  WHERE email = $3;`;
    let values = [otp, otpExpires, email];
    await sendEmail("sending_OTP", email, otp);
    return { query, values };
  } catch (error) {
    console.error("error resendOtpServices:", error);
    throw error;
  }
};

const verifyingOtpServices = async (email) => {
  try {
    let query = `UPDATE credentials SET is_verified = true WHERE email = $1`;
    let value = [email];
    return { query, value };
  } catch (error) {
    console.error("Verifying OTP error:", error);
    throw error;
  }
};

const UsersAuthtokenServices = async (passData) => {
  try {
    let isTokenValid;
    let query;
    let value;
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    isTokenValid = regex.test(passData);
    query = `SELECT * 
              FROM credentials 
              WHERE user_id = $1
              LIMIT 1;`;
    value = [passData];
    return { query, value, isTokenValid };
  } catch (error) {
    console.error("error UsersAuthtokenServices:", error);
    throw error;
  }
};

const resendOtp = async ({ email }) => {
  try {
    const users = await checkIfTheUserExist(email);

    if (!users.length) {
      return { error: "Email not found" };
    }

    const user = users[0];
    const { otp, otpExpires } = await authCodeGenerator();

    if (user.is_verified) {
      return { error: "Email already verified" };
    }

    await db.query(
      `UPDATE credentials SET email_otp = $1, otp_expires_at = $2  WHERE email = $3`,
      [otp, otpExpires, email],
    );

    await sendEmail("sending_OTP", email, otp);

    return {
      message: `OTP sent successfully to ${email}`,
      email: email,
    };
  } catch (error) {
    console.error("Sending OTP error:", error);
    throw error;
  }
};

const validPasswordServices = async (actualPss, storedPass) => {
  try {
    const validPassword = await bcrypt.compare(actualPss, storedPass);
    return { validPassword };
  } catch (error) {
    console.error("error validPasswordServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here  +++++++++++++++++++//

/********************************* TEST HERES ****************************************/

const Templated = async () => {
  try {
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

/********************************* TEST HERES ****************************************/

//++++++++++++++++++ helper here +++++++++++++++++++//
const checkIfTheUserExistServices = (passData) => {
  try {
    let query;
    let value;

    query = `SELECT 
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
    value = [passData];
    return { query, value };
  } catch (error) {
    console.error("error checkIfTheUserExistServices:", error);
    throw error;
  }
};

const userAuthEmailSenderServices = async (type, email, message) => {
  try {
    await sendEmail(type, email, message);
  } catch (error) {
    console.error("error userAuthSetPasswordEmailSendServices:", error);
    throw error;
  }
};

//++++++++++++++++++ helper here +++++++++++++++++++//

export {
  validPasswordServices,
  resendOtpServices,
  verifyingOtpServices,
  userAuthEmailSenderServices,
  registerUserServices,
  registerCredentailsUserServices,
  checkIfTheUserExistServices,
  resendOtp,
  UsersAuthtokenServices,
  userAuthSetPasswordServices,
};
