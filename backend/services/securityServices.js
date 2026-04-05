import db from "../config/db.js";
import authCodeGenerator from "../utils/AuthCodeGenerator.js";

import { checkIfTheUserExist } from "../models/UsersAuthModel.js";
import { sendEmail } from "../utils/mailer.js";

const verifyingOtpServices = async ({ email, otp }) => {
  try {
    const users = await checkIfTheUserExist(email);

    if (!users.length) {
      return { error: "Email not found" };
    }

    const user = users[0];

    if (user.is_verified) {
      return { error: "Email already verified" };
    }

    // Check if OTP expired
    const now = new Date();
    if (user.otp_expires_at && now > user.otp_expires_at) {
      return { error: "OTP has expired" };
    }

    // Check OTP match
    if (user.email_otp !== otp) {
      return { error: "Incorrect OTP" };
    }

    // Mark as verified
    await db.query(
      `UPDATE credentials SET is_verified = true WHERE email = $1`,
      [email],
    );

    await sendEmail("verified_email", email, " ");

    return {
      message: `Email verified successfully! You may now login: ${email}`,
      email,
    };
  } catch (error) {
    console.error("Verifying OTP error:", error);
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

const UsersAuthtokenServices = (passData) => {
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

const userAuthSetPasswordServices = (id, passData) => {
  try {
    let query = `UPDATE credentials
                 SET password = $1
                 WHERE user_id = $2
                 RETURNING email;
    `;
    let values = [passData, id];
    return { query, values };
  } catch (error) {
    console.error("error UsersAuthtokenServices:", error);
    throw error;
  }
};

export {
  verifyingOtpServices,
  resendOtp,
  UsersAuthtokenServices,
  userAuthSetPasswordServices,
};
